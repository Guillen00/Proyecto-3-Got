#include "http.h"
#include <iostream>


Net::Net(){QObject *parent = nullptr;}



void Net::replyFinished(QNetworkReply *reply)
{
qDebug() << reply->readAll();
}

void Net::GETHTTP(QString url)
{
  QUrl qrl(url);
  manager = new QNetworkAccessManager(this);
  connect(manager, SIGNAL(finished(QNetworkReply*)), this, SLOT(replyFinished(QNetworkReply*)));
  manager->get(QNetworkRequest(qrl));

}

void Net::POSTHTTP(QString url, string data){
    QUrl qrl(url);
    manager = new QNetworkAccessManager(this);
    connect(manager, SIGNAL(finished(QNetworkReply*)), this, SLOT(replyFinished(QNetworkReply*)));
    QJsonObject json;
    json.insert("userid","xxxx");
    json.insert("userpass","xxxx");
    QJsonDocument jsonDoc(json);
    QByteArray jsonData= jsonDoc.toJson();
    QNetworkReply* reply = manager->post(QNetworkRequest(qrl),jsonData);

}
