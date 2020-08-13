#include <QCoreApplication>
#include <cstdlib>
#include <iostream>
#include <QTextStream>
#include <stdlib.h>
#include <sstream>
#include <string>
#include <command.h>
#include <QNetworkAccessManager>



using namespace std;

/**
* @brief Funcion main es la que inicia la aplicacion , es donde se guardaran todos los repositorios locales en la computadora , se deben ingresar comandos especificos los cuales se explican en la funcion got help
* si este ingresa mal un codigo, el sistema se lo hara saber, y de estar de manera correcta el sistema hara la funcion respectiva al comando ingresado
*/

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);
    Command command;
    command.rutadestino ="/home/guillen00/Documents/Proyecto3/";
    command.normbreRepositorioActual = "Proyecto3";



    while(true){

        cout<< "Ingrese comando deseado"<<endl;
        char nombre[300];
        cin.getline(nombre,100);
        std::string str(nombre);
        std::istringstream isstream(str);

        string correr[5];
        int x=0;
        while(!isstream.eof()){

            std::string tempStr;

            isstream >> tempStr;

            correr[x]= tempStr;

            //cout << correr[x] << "\n";
            x++;
        }

        if(correr[0] == "got"){
            if (correr[1] == "help"){
                command.help();
            }
            else if (correr[1]=="init") {
                command.init(correr[2]);
            }
            else if (correr[1]=="add") {

                if (correr[2] == "-A"){
                    command.add(correr[3],1);
                }
                else if (correr[2] == ""){

                }
                else{
                    command.add(correr[2],0);
                }

            }
            else if (correr[1]=="commit") {
                int x=3;
                string mensaje = "";
                while(x < correr->length()+1){
                    mensaje= mensaje +" "+ correr[x];
                    x++;
                }
                command.commit(correr[2],mensaje);
            }
            else if (correr[1]=="status") {
                command.status(correr[2]);
            }
            else if (correr[1]=="rollback") {
                command.rollback(correr[2],correr [3]);
            }
            else if (correr[1]=="reset") {
                command.reset(correr[2]);
            }
            else if (correr[1]=="sync") {
                command.sync(correr[2]);
            }
            else{
                cout <<"El comando ingresado no es correcto"<<endl;
            }

        }
        else{
            cout <<"El comando ingresado no es correcto"<<endl;

        }

     }
    return a.exec();
}
