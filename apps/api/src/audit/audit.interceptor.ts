import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuditService } from "./audit.service";
import { User } from "@lib/data/entities/user.entity";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user, params } = req;

    // Se for apenas leitura (GET), não auditamos
    if (method === "GET") {
      return next.handle();
    }

    return next.handle().pipe(
      tap((data) => {
        try {
          // --- 1. Tenta descobrir o ID da entidade ---
          const rawId = params.id
            ? params.id
            : data && data.id
              ? data.id
              : "N/A";

          // Garante que entityId é string desde o início
          let entityId = String(rawId);

          // --- 2. Define o Nome da Entidade  ---
          const cleanUrl = url.split("?")[0];
          const urlParts = cleanUrl.split("/").filter((p: string) => p !== "");

          let mainResource = urlParts[0] === "api" ? urlParts[1] : urlParts[0];

          if (!mainResource) mainResource = "System";

          let entityNameStr =
            mainResource.charAt(0).toUpperCase() + mainResource.slice(1);

          if (entityNameStr.endsWith("s"))
            entityNameStr = entityNameStr.slice(0, -1);

          // Aqui entityNameStr já é string, não precisamos de String()
          const entityName = entityNameStr;

          // --- 3. Define a Ação  ---
          let action = "UNKNOWN";

          if (method === "POST") action = "CREATE";
          if (method === "PUT" || method === "PATCH") action = "UPDATE";
          if (method === "DELETE") action = "DELETE";

          // --- 4. OVERRIDES ---
          if (
            cleanUrl.includes("/auth/signin") ||
            cleanUrl.includes("/login")
          ) {
            action = "LOGIN";
          } else if (
            cleanUrl.includes("/auth/signup") ||
            cleanUrl.includes("/register")
          ) {
            action = "REGISTER";
          }

          // Define o nome final
          const finalEntityName =
            action === "LOGIN" || action === "REGISTER" ? "Auth" : entityName;

          // Se for Login, o ID é o do user logado
          if (action === "LOGIN") {
            // Aqui usamos String() porque data.user.id pode ser número ou indefinido
            entityId = String(data?.user?.id || user?.id || "N/A");
          }

          const finalAction =
            action === "LOGIN" || action === "REGISTER"
              ? action
              : `${action}_${finalEntityName.toUpperCase()}`;

          const details = `Method: ${method} | Path: ${cleanUrl}`;

          // --- 5. Grava o log ---
          this.auditService
            .log(
              finalAction,
              finalEntityName, 
              entityId,        
              user as User,    
              details
            )
            .catch((err) => {
              this.logger.error("Erro ao salvar log automático", err);
            });
        } catch (errSync) {
          this.logger.error("Erro ao preparar dados do log", errSync);
        }
      }),
    );
  }
}