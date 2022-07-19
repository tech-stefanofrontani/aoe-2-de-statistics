# AOE - Estadísticas por equipo

Consumiendo la api de aoe2.net, se buscan las partidas por equipo y se procesa para mostrar estadísticas por tipo de game: random map, quick play, lobbys, etc.

## Levantar server

```
npm start
```

## Deployar nuevos cambios

1. Hacer cambios en el repo.
2. Pushear cambios.
3. Mergear a main.
4. Entrar al [servidor VPS en my.vultr.com](https://my.vultr.com/subs/?id=3b718400-9355-45be-9e8b-7ac345cb95fa) a través de la terminal usando ssh usando las credenciales que aparecen ahi `root` y `IP Address`.

*cmd:*
```
ssh user@id
```

Luego usar la `password`.

5. Ir al repo dentro de la vps: `/var/www/aoe-2-de-statistics`.

```
cd /var/www/aoe-2-de-statistics
```

6. Actualizar los repos.

```
git pull origin main
```

6. b. (Opcional) Actualizar las dependencias.

```
npm install
```

7. Generar el build

```
npm run build
```

8. Llevar la carpeta con los static files dentro del build creado `/var/www/aoe-2-de-statistics/build` a `/var/www/html`

Dentro del repo */var/www/aoe-2-de-statistics*

```
sudo cp -a ./build/. /var/www/html
```

9. Reiniciar nginx

```
systemctl restart nginx
```

## Diseño en figma

[Diseño](https://www.figma.com/file/h73ioKGz0U0OnCXkI1kwSI/aoe-2-de-statistics?node-id=0%3A1)