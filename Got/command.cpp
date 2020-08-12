#include "command.h"
#include <fstream>
#include <cstdlib>
#include <QJsonValue>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QDebug>


#include <cpprest/http_client.h>
#include <cpprest/streams.h>
#include <jsoncpp/json/json.h>
//#include <cpprest/http_compression.h>
//#include <curl/curl.h>
#include <QNetworkAccessManager>
#include <QUrl>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QJsonObject>
#include <QArrayData>
#include <QObject>


using namespace web::http;
using namespace web::http::client;


Command::Command()
{

}

void Command::help(){

    cout<<"Lista de comandos y su función:  "<<endl;
    cout<<"  "<<endl;
    cout<<"got init <name>  "<<endl;
    cout<<"  "<<endl;
    cout<<"Instancia un nuevo repositorio en el servidor y lo identifica con el nombre indicado por <name>"<<endl;
    cout<<"  "<<endl;
    cout<<"got help "<<endl;
    cout<<"  "<<endl;
    cout<<"Este comando va a mostrar en la consola la información de lo que hace cada comando en Got"<<endl;
    cout<<"  "<<endl;
    cout<<"got add [-A] [name]"<<endl;
    cout<<"  "<<endl;
    cout<<"Permite agregar todos los archivos que no estén registrados o que tengan nuevos cambios al repositorio, puede usar el flag -A para agregar todos los archivos relevantes."<<endl;
    cout<<"  "<<endl;
    cout<<"got commit <mensaje> "<<endl;
    cout<<"  "<<endl;
    cout<<"Envía los archivos agregados y pendientes de commit al servidor. Se debe especificar un mensaje a la hora de hacer el commit. "<<endl;
    cout<<"  "<<endl;
    cout<<"got status <file>"<<endl;
    cout<<"  "<<endl;
    cout<<"Este comando nos va a mostrar cuales archivos han sido cambiados, agregados o eliminados de acuerdo con el commit anterior."<<endl;
    cout<<"  "<<endl;
    cout<<"got rollback <file> <commit>"<<endl;
    cout<<"  "<<endl;
    cout<<"Permite regresar un archivo en el tiempo a un commit específico. "<<endl;
    cout<<"  "<<endl;
    cout<<"got reset <file>"<<endl;
    cout<<"  "<<endl;
    cout<<"Deshace cambios locales para un archivo y lo regresa al último commit."<<endl;
    cout<<"  "<<endl;
    cout<<"got sync <file>"<<endl;
    cout<<"  "<<endl;
    cout<<"Recupera los cambios para un archivo en el servidor y lo sincroniza con el archivo en el cliente."<<endl;


}


void Command::add(string name, int selector){
    string copiar;
    if (selector == 0){
        string rutaingreso;
        cout<< "Ingrese el la direccion del la carpeta donde se encuentra el documento: " << endl;
        cin >>rutaingreso;
        FILE * archivo;

        if(archivo =fopen((rutaingreso+"/"+name).c_str(),"r")){

            copiar = "cp " + rutaingreso+"/"+name +" "+ rutadestino;


            system((copiar.c_str()));
            lista_pendientes.push_back(name);


        }
        else{
            cout <<"El archivo no existe"<< endl;
        }

    }
    else{
        if( DIR* pDIR = opendir(name.c_str()) )
        {
          while(dirent* entry = readdir(pDIR))
          {
            std::string fileName = entry->d_name;

            if( fileName != "." && fileName != ".." ){
                copiar = "cp " + name+"/"+fileName +" "+ rutadestino;
                system((copiar.c_str()));

                lista_pendientes.push_back(fileName);
            }

          }
          closedir(pDIR);
        }
        else{
            cout <<"El directorio no existe"<< endl;
        }
    }
    //lista_agregados.push_back(name);
    //lista_pendientes.push_back(name);
}


void Command::commit(string mensaje){

    string texto = "";
    string texto1 ="";
    web::json::value json_v ;
    int x=0;


    QJsonObject recordObject;


    QJsonArray FileNameArray;
    QJsonArray FileDataArray;
    while(lista_pendientes.size()>0){
        texto ="";
        char cadena[300];

        ifstream fe(rutadestino+lista_pendientes.front());
        while (!fe.eof()) {
          fe >> cadena;

          getline(fe,texto1);
          //cout << cadena << endl;
          //texto = texto +"/n"+ std::string(cadena);
          texto = texto + "/n" +std::string(cadena)+ texto1;
        }
        fe.close();

        //cout<< "-------------------------------------Documento: "<<lista_pendientes.front()<<"---------------------------------------" <<endl;
        //cout<< texto <<endl;


        FileNameArray.push_back(lista_pendientes.front().c_str());
        json_v["files"][x] = web::json::value::string(lista_pendientes.front().c_str());
        json_v["fileContent"][x] = web::json::value::string(texto.c_str());
        FileDataArray.push_back(texto.c_str());
        lista_pendientes.pop_front();
        x++;
    }
    recordObject.insert("repoName", QJsonValue::fromVariant(normbreRepositorioActual.c_str()));
    recordObject.insert("mensaje", QJsonValue::fromVariant(mensaje.c_str()));
    recordObject.insert("files", FileNameArray);
    recordObject.insert("fileContent", FileDataArray);

    QStringList nuevo ;
    FileNameArray.fromStringList(nuevo) ;


    QJsonArray recordsArray;
    recordsArray.push_front(recordObject);
    //qDebug() << recordsArray ;


    json_v["repoName"] = web::json::value::string(normbreRepositorioActual.c_str());
    json_v["mensaje"] = web::json::value::string(mensaje.c_str());


    cout<< json_v<<endl;
    POST("http://localhost:4000/links/commit/",json_v);

}
void Command::status (string file){


    QJsonObject recordObject;
    recordObject.insert("repoName", QJsonValue::fromVariant(normbreRepositorioActual.c_str()));
    recordObject.insert("file", QJsonValue::fromVariant(file.c_str()));

    QJsonArray recordsArray;
    recordsArray.push_front(recordObject);
    qDebug() << recordsArray ;

    web::json::value json_v ;
    json_v["repoName"] = web::json::value::string(normbreRepositorioActual.c_str());
    json_v["file"] = web::json::value::string(file.c_str());
    POST("http://localhost:4000/links/status/",json_v);

}
void Command::rollback (string file,string commit){


    web::json::value json_v ;
    json_v["repoName"] = web::json::value::string(normbreRepositorioActual.c_str());
    json_v["file"] = web::json::value::string(file.c_str());
    json_v["commitID"] = web::json::value::string(commit.c_str());


    ofstream fs(rutadestino+file);
    fs << POST("http://localhost:4000/links/rollback/",json_v) << endl;
    fs.close();


}

void Command::reset(string file){

    QJsonObject recordObject;
    recordObject.insert("repoName", QJsonValue::fromVariant(normbreRepositorioActual.c_str()));
    recordObject.insert("file", QJsonValue::fromVariant(file.c_str()));
    recordObject.insert("commitID", QJsonValue::fromVariant(file.c_str()));
    QJsonArray recordsArray;
    recordsArray.push_front(recordObject);
    qDebug() << recordsArray ;


    web::json::value json_v ;
    json_v["repoName"] = web::json::value::string(normbreRepositorioActual.c_str());
    json_v["file"] = web::json::value::string(file.c_str());

    ofstream fs(rutadestino+file);
    fs << POST("http://localhost:4000/links/rollback/",json_v) << endl;
    fs.close();
}
void Command::sync(string file){


    web::json::value json_v ;
    json_v["repoName"] = web::json::value::string(normbreRepositorioActual.c_str());
    json_v["file"] = web::json::value::string(file.c_str());
    json_v["commitID"] = web::json::value::string(file.c_str());
    string newdata;
    newdata = POST("http://localhost:4000/links/sync/",json_v);
    string olddata = "";
    char cadena[300];
    ifstream fe(rutadestino+file);
    while (!fe.eof()) {
        fe >> cadena;
        olddata = olddata + cadena;
      }
      fe.close();
     if(olddata == newdata){
        cout <<"El archivo se encuentra actualizado"<<endl;

     }
     else{
      cout<< "___(1)_______________________________Archivo local:_____________________________________________"<<endl;
      cout << olddata<<endl;
      cout<< "___(2)_____________________________Archivo Base de Datos:_______________________________________"<<endl;
      cout<< newdata<<endl;
      cout<< "   "<<endl;
      cout<< "   "<<endl;
      cout<< "   "<<endl;
      cout<< "Digite el numero que desea conservar"<<endl;
      int dato;
      cin>> dato ;
      if(dato == 1){

      }
      else if(dato == 2){
          ofstream fs(rutadestino+file);
          fs << newdata << endl;
          fs.close();
      }
     }
}
void Command::init (string name){

    normbreRepositorioActual = name;
    string ruta1 = rutadestino+name;
    char buffer[100];
    strcpy(buffer,ruta1.c_str());
    mkdir(buffer,0777);
    ruta1 = rutadestino+name+"/";
    rutadestino=ruta1;


    web::json::value json_v ;
    json_v["name"] = web::json::value::string(name);
    POST("http://localhost:4000/links/init/",json_v);
}

void Command::GET(string direccion){

    http_client client(direccion);

        http_response response;
        response = client.request(methods::GET, "/get").get();
        std::cout << response.extract_string().get() << "\n";

        response = client.request(methods::GET, "/get").get();
        std::cout << "url: " << response.extract_json().get()[U("url")] << "\n";

}

string Command::POST(string direccion, web::json::value json1){


    http_client client_lmdb(direccion);
    http_request request(methods::POST);
    request.headers().add("name", "contentTypeV");

    request.set_body(json1);

    http_response response;
    response = client_lmdb.request(request).get();

    web::json::value json_v ;


    cout << response.to_string() << endl;

    return response.to_string();

}

Json::Value toJson(string message){ Json::Value val;
    Json::Reader reader;
    bool b = reader.parse(message, val);
    if (!b)
        cout << "Error: " << reader.getFormattedErrorMessages();
    return val;
}
