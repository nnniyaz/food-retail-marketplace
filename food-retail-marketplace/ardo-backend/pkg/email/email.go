package email

import "gopkg.in/gomail.v2"

type Email interface {
	SendMail(to []string, subject string, htmlBody string) error
}

type Config struct {
	Host     string
	Port     int
	Username string
	Password string
}

type email struct {
	dialer *gomail.Dialer
}

func New(cfg Config) (Email, error) {
	d := gomail.NewDialer(cfg.Host, cfg.Port, cfg.Username, cfg.Password)
	if err := d.DialAndSend(); err != nil {
		return nil, err
	}
	return &email{dialer: d}, nil
}

func (e *email) SendMail(to []string, subject string, htmlBody string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", e.dialer.Username)
	m.SetHeader("To", to...)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", htmlBody)
	return e.dialer.DialAndSend(m)
}
