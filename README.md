# playwright-login-app

### Instalación inicial

- Instalar dependencias:
  ```bash
  npm i
  ```
- Instalar chromium desde playwright:
  ```bash
  npx playwright install chromium
  ```

### Credenciales clave única

1. Copia el `.env.template` para generar tu `.env`.
2. `CU_DNI`: Rut para clave única. Debe estar con punto y guión. Ej: 11.111.111-1. En caso de el que dígito verificar sea "K", dejarlo con mayúscula.
3. `CU_PASSWORD`: Contraseña para clave única.

### Desarrollo

Ejecutar proyecto con:

```bash
npm run dev
```
