#ifndef FIREBASE_H
#define FIREBASE_H

#include <QObject>
#include <QJsonObject>

// Docs at:
// http://doc.qt.io/qt-5/qtqml-tutorials-extending-qml-example.html

class QFirebase : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString email    READ email  NOTIFY emailChanged)
    Q_PROPERTY(QString name     READ name   NOTIFY nameChanged)

public:
    explicit QFirebase(QObject *parent = nullptr);

    const QString RESSTAT_SUCCESS   = "succ";
    const QString RESSTAT_FAIL      = "fail";

    QString email();
    QString name();

    Q_INVOKABLE QJsonObject getAuthParams();

    Q_INVOKABLE void        signin(QString email, QString password);
    Q_INVOKABLE void        signup(QString email, QString password, QString name);
    Q_INVOKABLE void        signinByAuthParams(QJsonObject auth_params);
    Q_INVOKABLE void        signout();

signals:
    void emailChanged();
    void nameChanged();

    void signinCompleted(QString, QJsonObject, bool);

private:
    QString m_email;
    QString m_name;

    QString _possibleEmail;
    QString _possibleName;

    QString _localId;
    QString _accessToken;
    QString _refreshToken;
    int     _expiresIn;

    void _setEmail(const QString &email);
    void _setName(const QString &name);

    void _authMethod(QString email, QString password, QString methodName, QString displayName = "");
    void _refresh(QString refresh_token);

    void _rdbSaveUserInfo();

private slots:
    void _onAuthResponse(QByteArray);
    void _onAuthCompleted(QString, QJsonObject, bool);
    void _onRdbSaveResponse(QByteArray);
};

#endif // FIREBASE_H
