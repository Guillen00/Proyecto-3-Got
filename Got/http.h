#ifndef HTTP_H
#define HTTP_H


#include <QObject>

#include <QtCore>
#include <QNetworkAccessManager>
#include <QNetworkReply>
using namespace std;


class Net : public QObject
{
Q_OBJECT

  QNetworkAccessManager *manager;
private slots:
  void replyFinished(QNetworkReply *);
public:
  Net();
  ~Net() {}
  void GETHTTP(QString url);
  void POSTHTTP(QString url, string data);

};


#endif // HTTP_H
