# TACS-1c2017-G1

## Help
# Clonar Proyecto:
  En la carpeta donde se desea clonar:
  ```
  git clone https://github.com/TACS-1c2017-G1/TACS-1c2017-G1
  ```
  
# Para importarlo a Eclipse:
  Ir a la perspectiva Git y agregar el proyecto existente.
  Luego en la perspectiva Java, importar el proyecto como un proyecto Maven.
  
# Instalar dependencias:
  En el directorio raíz del proyecto hacer:
  ```
  mvn clean install
  ```

# Empaquetar el proyecto:
  En el directorio raíz del proyecto hacer:
  ```
  mvn clean package
  ```

# Correr el proyecto:
  En el directorio raíz del proyecto hacer:
  ```
  java -jar target/TACS-1c2017-G1-1.0-SNAPSHOT.jar
  ```

# Probarlo:
  Desde algun browser, entrar a http://localhost:8080/searchActor?name=ricardo-darin