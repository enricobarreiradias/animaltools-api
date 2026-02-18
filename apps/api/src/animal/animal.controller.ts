import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Query 
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger'; 

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  // --- ROTAS PÚBLICAS ---

  @Post('integration/webhook') 
  async webhook(@Body() externalData: any) {
    return await this.animalService.processWebhook(externalData);
  }

  @Get('integration/sync')
  async syncAnimals(
    @Query('start') start?: string, 
    @Query('end') end?: string      
  ) {
    return await this.animalService.syncFromExternalApi(start, end);
  }

  // --- ROTAS PROTEGIDAS ---
  
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalService.create(createAnimalDto);
  }
  
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.animalService.findAll();
  }

  // --- 2. ROTA NOVA  ---
  @Get('export/research')
  //@UseGuards(AuthGuard('jwt')) // Adicionei proteção JWT por segurança 
  @ApiOperation({ 
    summary: 'Exportação Completa para Pesquisa',
    description: 'Retorna TODOS os dados de TODOS os animais, incluindo avaliações dentárias e dentes.' 
  })
  async exportResearchData() {
    return this.animalService.findAllForResearch();
  }

  @Get('filters/farms')
  @UseGuards(AuthGuard('jwt'))
  getFarmsList() {
    return this.animalService.findUniqueFarms();
  }

  @Get('filters/clients')
  @UseGuards(AuthGuard('jwt'))
  getClientsList() {
    return this.animalService.findUniqueClients();
  }

  // --- ROTAS COM ID ---

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.animalService.findOne(+id);
  }

  // --- UPDATE ---
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
      @Param('id') id: string, 
      @Body() updateAnimalDto: UpdateAnimalDto,
  ) {
    return this.animalService.update(+id, updateAnimalDto);
  }

  // --- DELETE ---
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(
      @Param('id') id: string,
  ) {
    return this.animalService.remove(+id);
  }
}