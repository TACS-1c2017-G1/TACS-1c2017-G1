cat tacs-backend/src/main/resources/asciiart.txt

echo "Compilar front end? Necesita tener instalado npm (y/n)"
read -t 30 front

if [ "$front" = "y" ]; then
#Compiling the front-end
echo 'Compiling front end'
cd tacs-backend/
cd src/main/resources/static/
sudo npm install && gulp concat
cd ../../../../../
fi


echo "Compilar back end? (y/n)"
read -t 30 back

if [ "$back" = "y" ]; then
#Install the project
echo 'Making project'
cd tacs-backend/
mvn clean install -DskipTests -P openshift
#Move the Web Archive File to the Tomcat root
echo 'Moving WAR to Tomcat root'
sudo cp webapps/*.war /opt/tomcat/webapps/
#Removing target folder
echo 'Removing target folder'
rm -rf target/
#Open the project main url (Could be too early)
echo 'Openning browser for you'
xdg-open http://localhost:8080/
cd ../
#See logs
echo 'Showing Logs'
sudo tail -f /opt/tomcat/logs/catalina.out
fi
