#ifndef COMMAND_H
#define COMMAND_H


#include <QString>
#include <iostream>
#include <sys/stat.h>
#include <string>
#include <dirent.h>
#include <cstdlib>
#include <iostream>
#include <QTextStream>
#include <stdlib.h>
#include <sstream>
#include <string>
#include <exception>
#include <filesystem>

#include <fstream>
#include <cstdlib>
#include <QJsonValue>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QDebug>


#include <cpprest/http_client.h>
#include <QNetworkAccessManager>
#include <QUrl>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QJsonObject>
#include <QArrayData>
#include <QObject>

using namespace std;
using namespace web::http;
using namespace web::http::client;
/**
* @brief Clase Command que funciona para activar las diferentes funciones en las cuales se basa la aplicacion de consola
* @author Leonardo Guillen
*/

class Command
{

public:
    /**
    * @brief El constructor de la clase Command
    * @author Leonardo
    */
    Command();
    /**
    * @brief Funcion init funciona creando un repositorio local y en la base de datos con el nombre del parametro ingresado
    * @author Leonardo
    */
    void init (string name) ;
    /**
    * @brief Funcion help tiene la funcion de imprimir toda la lista de comandos que podemos utilizar y cual es la funcion de cada uno de ellos
    * @author Leonardo
    */
    void help();
    /**
    * @brief Funcion add se encarga de añadir un archivo al repositorio local o una carpeta si se ingresa un (-A), el selector envia un 0 si es un archivo  o un 1 si es una carpeta
    * @author Leonardo
    */
    void add(string name,int selector);
    /**
    * @brief Funcion commit lee la lista de pendientes y los sube al repositorio en la base de datos
    * @author Leonardo
    */
    void commit(string mensaje);
    /**
    * @brief Funcion status muestra es estado del archivo en la base de datos
    * @author Leonardo
    */
    void status (string file);
    /**
    * @brief Funcion rollback devuelve el archivo ingresado al commit indicado, en la base de datos
    * @author Leonardo
    */
    void rollback (string file,string commit);
    /**
    * @brief Funcion reset devuelve el archivo al ultimo commit de la base de datos
    * @author Leonardo
    */
    void reset(string file);
    /**
    * @brief Funcion sync compara un archivo local con un archivo de la base de datos si es igual aparecera que son iguales sino de le pedira al cliente elegir cual dejar
    * @author Leonardo
    */
    void sync(string file);
    /**
    * @brief Lista de agregados retiene los documentos agregados recientemente
    * @author Leonardo
    */
    std::list <string> lista_agregados;
    /**
    * @brief Lista de pendientes retiene los datos que estan pendientes a subir y cuando se suben se eliminan de esta lista
    * @author Leonardo
    */
    std::list <string> lista_pendientes;
    /**
    * @brief String que contiene la ruta de destino , la ruta donde se encuentra el reporitorio local creado
    * @author Leonardo
    */
    string rutadestino;
    /**
    * @brief String que contiene  el nombre del repositorio actual
    * @author Leonardo
    */
    string normbreRepositorioActual;

    /**
    * @brief Funcion GET recibe una direccion a la cual le hara una peticion tipo get y retornara lo que la base de datos le envie
    * @author Leonardo
    */
    void GET(string direccion);
    /**
    * @brief Funcion POST recibe una direccion a la cual le hara una peticion tipo post , envia un tipo json con la informacion que requiere la api y retornara lo que la base de datos le envie
    * @author Leonardo
    */
    string POST(string direccion, web::json::value json);

};

#endif // COMMAND_H
