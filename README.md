# E1 :construction:

* :pencil2: **Nombre Grupo:** Mish - PokeDTI

* Link deploy: [Poke DTI](https://poke-dti.netlify.app/)

## Descripción general :thought_balloon:

### ¿De qué se tratará el proyecto?

Nuestro proyecto será un juego propuesto parecido al juego Dress to Impress de Roblox 
pero versión Pokémon, donde los jugadores, a través de partidas en *lobbies*, 
podrán vestir a un Pókemon de su elección (dentro de una lista de opciones) 
con distintos accesorios según un tema que haya elegido un jugador anfitrión, 
y así competir por puntos entre ellos, mediante un sistema de votaciones 
parecido al juego original.

Nuestro proyecto es un juego que NO está hecho en tablero,
pero igualmente implementa funcionalidad drag & drop y hará uso de web sockets
en el futuro.

### ¿Cuál es el fin o la utilidad del proyecto?
La utilidad de nuestro juego, como producto hacia nuestros jugadores,
es ofrecer una manera accesible de jugar un juego de vestir online.
Nuestro juego, para sus desarrolladores, permite extender funcionalidad
fácilmente y en tiempo real gracias a su arquitectura de aplicación web.

### ¿Quiénes son los usuarios objetivo de su aplicación?
Los jugadores pueden estar en el rango de 10-30 años.
El juego no será complejo y la UI deberá ser intuitiva.

## Historia de Usuarios :busts_in_silhouette:

### Login
1. Como **jugador no registrado** quiero **registrarme**
   para **jugar con una cuenta**.
2. Como **jugador registrado** quiero **acceder a mi cuenta**
   para **jugar con mi cuenta**.

### Lobbies
1. Como **jugador** quiero **crear un lobby**
   para **empezar un nuevo juego**.
2. Como **jugador** quiero **unirme a un lobby**
   para **jugar con otras personas**.

### Dentro del juego
1. Como **jugador** quiero **elegir un pokemon**
   para **plantear un diseño a mi gusto**.
2. Como **jugador** quiero **vestir a mi pokemon**
   para **competir en la partida**.
3. Como **jugador** quiero **votar por otro pokemon**
   para **hacer notar que me gustó el diseño de otro jugador**.
4. Como **jugador** quiero **salir o terminar una partida**
   para **dejar de jugar**.

### Configuración de cuenta
1. Como **usuario** quiero **editar mi perfil**
   para **personalizar mi interacción entre otros jugadores**.
2. Como **usuario** quiero **editar mis datos personales,
   como correo y contraseña**
   para **mantener control sobre mi cuenta**.

### Administrador
1. Como **administrador** quiero **asignar roles a otros usuarios**
   para **permitirles darle permisos a otros aspectos de la aplicación**.
2. Como **administrador** quiero **ver los usuarios registrados**
   para **gestionar la base de datos**.
3. Como **administrador** quiero **monitorear los lobbies activos**
   para **asegurarme de la integridad de la página**.
4. Como **administrador** quiero **ver las estadísticas de los jugadores**
   para **monitorear la actividad de los jugadores activos**.

### Reportes
1. Como **usuario** quiero **reportar un jugador**
   para **hacer notar de comportamiento inadecuado**.
2. Como **administrador** quiero **ver los reportes de un jugador**
   para **determinar la siguiente acción a tomar**.

### Otros
1. Como **jugador** quiero **ver el historial de partidas
   de un jugador cualquiera, ya sea yo como otro jugador de la partida**
   para **conocer la actividad del jugador**.
2. Como **usuario** quiero **ver el top 3 de jugadores**
   para **conocer el ranking de jugadores activos**.

## Diagrama Entidad-Relación :scroll:
<!-- Insertamos la imagen ER-Model.png -->
![ER-Model](assets/Diagrama%20ER%20Web.drawio.png)

## Diseño Web :computer:

<!-- Documento de diseño web -->
### :art: Documento de diseño
### Colores  
- Primarios   
![AdobeColor-Colores Primarios](https://github.com/user-attachments/assets/bd4c49de-c91d-4a42-bee9-970b3a49a0a1)

- Secundarios  
![AdobeColor-Colores Secundarios](https://github.com/user-attachments/assets/de585592-8a82-4d40-9b27-86d5d8cbceda)

- Alerta  
![AdobeColor-Colores Alerta](https://github.com/user-attachments/assets/dd68528b-547e-49d4-a8f6-92dbc50cb8c9)

### Tipografía :
- Itim    
![TIPO GRAFIA 1](https://github.com/user-attachments/assets/049945c0-9322-476d-8c79-299ed9b05b19)
- POKEMON DP PRO   
![TIPO GRAFIA 2](https://github.com/user-attachments/assets/a4c30bfb-5adf-4401-9f95-098f212dc4c0)


<!-- Vistas principales -->
### :mag: Vistas principales

### Landing Page
- Desktop
![Landing page](https://github.com/user-attachments/assets/c7844250-13cf-4e61-ac7f-6e8c9ea67cbf)
- Tablet
![Tableta](https://github.com/user-attachments/assets/84abf2e6-fa38-47f3-b9ef-f0415c4b351e)


# Reglas 
![Reglas](https://github.com/user-attachments/assets/30f7192c-bd14-45b7-a0ea-8090f3774fe9)

### Buscar o crear una sala  
- Desktop  
![Find Game o new Game](https://github.com/user-attachments/assets/5d080c6d-37e8-4f9c-b79f-1f5189959e5e)
- Tableta  
![Tableta](https://github.com/user-attachments/assets/7d6812b3-907b-4317-bc7a-40799b1fc6a7)
- Teléfono  
![Telefono](https://github.com/user-attachments/assets/63046615-f3e7-43d0-9b9c-f52ffe5307de)

### Dentro de una sala
- Como dueño
![o selecct Pokemon (owner)](https://github.com/user-attachments/assets/4b715a5f-bbcf-490e-a3da-99f7400a4b42)
- En otro caso
![o selecct Pokemon (player)](https://github.com/user-attachments/assets/3cb5a147-1e37-41d9-b04e-cecb7a4b0fce)

### About Us
![About Us](https://github.com/user-attachments/assets/38ec0103-f10c-4c2b-94e4-2505d8d78eb5)

### Dress Pokémon Game   
- Desktop  
![Dress Pokemon](https://github.com/user-attachments/assets/51853c9c-a933-4e34-a072-e3752ddfd495)
- Tableta  
![Tableta (1)](https://github.com/user-attachments/assets/a87a779e-7e41-4fe3-bc5a-236345e346c5)
- Teléfono  
![Telefono (1)](https://github.com/user-attachments/assets/b0e094a8-6651-41de-a70d-02b732795a54)

 ### Votación Pokémon Game    
 - Desktop  
![Votar Pokemon](https://github.com/user-attachments/assets/e8d59d28-1f54-463b-95ae-d3b7272fa55a)
- Tableta  
![Tableta (2)](https://github.com/user-attachments/assets/7ef5d811-c136-4bf3-a410-f2b9128be0ea)
- Teléfono  
![Telefono (2)](https://github.com/user-attachments/assets/99d3d8c6-0ea9-4b9e-bd7d-7a65e8898004)


<!-- Logo -->
### :art: Logo     
![Poke DTI (1) 1](https://github.com/user-attachments/assets/ed5c2223-73f0-4c37-85cb-e03694a0d5dc)


<!-- ejemplo de aplicacion -->
### :iphone: Ejemplo de aplicación
- navbar    
![NAVBAR 1](https://github.com/user-attachments/assets/994205e0-bcbe-4c29-8b15-40c6c7cfafc3)
- Componente tarjeta de presentación   
![Tarjeta de Presentación](https://github.com/user-attachments/assets/e01f5b0e-0965-4b9b-a112-22863844b557)
- Componente Formulario Creación de sala   
![Form sala](https://github.com/user-attachments/assets/af3fa0de-cea9-42d2-80af-4855aa402cc0)
- Componente para unirse a una sala   
![Show Sala](https://github.com/user-attachments/assets/6b09fec5-97bb-4c7a-a910-04bfd2137e06)
- Tarjeta con información de perfil para página de perfil del usuario    
![Datos de perfil](https://github.com/user-attachments/assets/c60330a4-e99d-4c26-a307-b2942f71f960)


