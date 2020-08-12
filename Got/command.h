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

class Command
{

public:
    Command();
    void init (string name) ;
    void help();
    void add(string name,int selector);
    void commit(string mensaje);
    void status (string file);
    void rollback (string file,string commit);
    void reset(string file);
    void sync(string file);
    std::list <string> lista_agregados;
    std::list <string> lista_pendientes;
    string rutadestino;
    string normbreRepositorioActual;


    void GET(string direccion);
    void POST(string direccion, web::json::value json);

};

#endif // COMMAND_H
