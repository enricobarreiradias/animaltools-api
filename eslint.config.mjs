// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'dist/**',
      '**/node_modules/**',
      'coverage/**',
    ],
  },

  eslint.configs.recommended,

  // 🔴 Config TypeScript para TODO o Monorepo (Apps e Libs)
  {
    // AQUI ESTÁ A MUDANÇA: Adicionamos apps e libs para ele pegar seus arquivos
    files: ['apps/**/*.ts', 'libs/**/*.ts', 'src/**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // Regras específicas para TypeScript
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Permite o uso de any (Resolve seus erros atuais)
      '@typescript-eslint/no-floating-promises': 'warn', // Apenas avisa, não bloqueia
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off', // Desliga erro de atribuição insegura
      '@typescript-eslint/no-unsafe-member-access': 'off', // Desliga erro de acesso a membros de any
      '@typescript-eslint/no-unsafe-call': 'off', // Desliga erro de chamar funções any
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto', // Resolve aquele problema do CRLF do Windows de vez
        },
      ],
    },
  },

  // 🟢 Config para JS da pasta config (SEM type checking)
  {
    files: ['config/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  eslintPluginPrettierRecommended,
);
