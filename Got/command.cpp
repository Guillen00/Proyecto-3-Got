#include "command.h"
#include <fstream>
#include <cstdlib>
#include <QJsonValue>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QDebug>

#include <http.h>

//#include <cpprest/http_client.h>
//#include <curl/curl.h>
#include <QNetworkAccessManager>
#include <QUrl>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QJsonObject>
#include <QArrayData>
#include <QObject>

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
    /*if( DIR* pDIR = opendir(rutadestino.c_str()) )
    {
      while(dirent* entry = readdir(pDIR))
      {
        std::string fileName = entry->d_name;

        if( fileName != "." && fileName != ".." ){

           if (lista_pendientes.front() == fileName){
            char cadena[300];

            ifstream fe(rutadestino+"/"+fileName);
            while (!fe.eof()) {
              fe >> cadena;
              getline(fe,texto1);
              //cout << cadena << endl;
              //texto = texto +"/n"+ std::string(cadena);
              texto = texto + "/n" +std::string(cadena)+ texto1;
            }
            fe.close();
            lista_pendientes.pop_front();
           }



        }


      }
      closedir(pDIR);
    }*/

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
        FileDataArray.push_back(texto.c_str());
        lista_pendientes.pop_front();
    }
    recordObject.insert("repoName", QJsonValue::fromVariant(normbreRepositorioActual.c_str()));
    recordObject.insert("mensaje", QJsonValue::fromVariant(mensaje.c_str()));
    recordObject.insert("files", FileNameArray);
    recordObject.insert("fileContent", FileDataArray);




    QJsonArray recordsArray;
    recordsArray.push_front(recordObject);
    qDebug() << recordsArray ;


}
void Command::status (string file){


    QJsonObject recordObject;
    recordObject.insert("repoName", QJsonValue::fromVariant(normbreRepositorioActual.c_str()));
    recordObject.insert("file", QJsonValue::fromVariant(file.c_str()));

    QJsonArray recordsArray;
    recordsArray.push_front(recordObject);
    qDebug() << recordsArray ;

}
void Command::rollback (string file,string commit){

    QJsonObject recordObject;
    recordObject.insert("repoName", QJsonValue::fromVariant(normbreRepositorioActual.c_str()));
    recordObject.insert("file", QJsonValue::fromVariant(file.c_str()));
    recordObject.insert("commitID", QJsonValue::fromVariant(file.c_str()));
    QJsonArray recordsArray;
    recordsArray.push_front(recordObject);
    qDebug() << recordsArray ;

}
void Command::reset(string file){

    QJsonObject recordObject;
    recordObject.insert("repoName", QJsonValue::fromVariant(normbreRepositorioActual.c_str()));
    recordObject.insert("file", QJsonValue::fromVariant(file.c_str()));
    recordObject.insert("commitID", QJsonValue::fromVariant(file.c_str()));
    QJsonArray recordsArray;
    recordsArray.push_front(recordObject);
    qDebug() << recordsArray ;


}
void Command::sync(string file){

    QJsonObject recordObject;
    recordObject.insert("repoName", QJsonValue::fromVariant(normbreRepositorioActual.c_str()));
    recordObject.insert("file", QJsonValue::fromVariant(file.c_str()));
    recordObject.insert("commitID", QJsonValue::fromVariant(file.c_str()));
    QJsonArray recordsArray;
    recordsArray.push_front(recordObject);
    qDebug() << recordsArray ;
}
void Command::init (string name){


    GET("hoia","jaja");
    /*normbreRepositorioActual = name;
    string ruta1 = rutadestino+name;
    char buffer[100];
    strcpy(buffer,ruta1.c_str());
    mkdir(buffer,0777);
    ruta1 = rutadestino+name+"/";
    rutadestino=ruta1;

    QJsonObject recordObject;
    recordObject.insert("repoName", QJsonValue::fromVariant(name.c_str()));
    QJsonArray recordsArray;
    recordsArray.push_back(recordObject);
    //cout<< recordsArray<< endl;
    qDebug() << recordsArray ;*/
}

void Command::GET(string direccion, string json){
    /*QNetworkAccessManager manager;
    QUrl url =QUrl("http://localhost:3000/user");
    QNetworkRequest req(url);
    req.setRawHeader( "User-Agent" , "Meeting C++ RSS Reader" );
    QNetworkReply* reply = manager.get(req);
    if ( reply->error() != QNetworkReply::NoError ) {
        qWarning() <<"ErrorNo: "<< reply->error() << "for url: " << reply->url().toString();
        qDebug() << "Request failed, " << reply->errorString();
        qDebug() << "Headers:"<<  reply->rawHeaderList()<< "content:" << reply->readAll();

        return;
    }
    qDebug() <<"content:" << reply->readAll();*/
    Net handler ;
    handler.POSTHTTP("http://localhost:4000/links/init/","hsasa");

}
void Command::POST(string direccion, string json1){
    QUrl serviceUrl = QUrl("https://www.jusmine.jp/KA/KGBloginCheck");
    QNetworkRequest request(serviceUrl);
    QJsonObject json;
    json.insert("userid","xxxx");
    json.insert("userpass","xxxx");
    QJsonDocument jsonDoc(json);
    QByteArray jsonData= jsonDoc.toJson();
    request.setHeader(QNetworkRequest::ContentTypeHeader,"application/json");
    request.setHeader(QNetworkRequest::ContentLengthHeader,QByteArray::number(jsonData.size()));
    QNetworkAccessManager networkManager;

    networkManager.post(request, jsonData);

}
