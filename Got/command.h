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

#include <QNetworkAccessManager>

using namespace std;


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


    void GET(string direccion, string json);
    void POST(string direccion, string json);

};

#endif // COMMAND_H
