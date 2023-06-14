package config

type Config struct {
	mongoUri  string
	isDevMode bool
	smtpUser  string
	smtpPass  string
	smtpHost  string
	smtpPort  string
	apiUri    string
	clientUri string
}

func New(mongoUri string, isDevMode bool, smtpUser string, smtpPass string, smtpHost string, smtpPort string, apiUri string, clientUri string) *Config {
	return &Config{
		mongoUri:  mongoUri,
		isDevMode: isDevMode,
		smtpUser:  smtpUser,
		smtpPass:  smtpPass,
		smtpHost:  smtpHost,
		smtpPort:  smtpPort,
		apiUri:    apiUri,
		clientUri: clientUri,
	}
}

func (c *Config) GetMongoUri() string {
	return c.mongoUri
}

func (c *Config) GetIsDevMode() bool {
	return c.isDevMode
}

func (c *Config) GetClientUri() string {
	return c.clientUri
}

type ServiceConfig struct {
	smtpUser  string
	smtpPass  string
	smtpHost  string
	smtpPort  string
	apiUri    string
	clientUri string
}

func (c *Config) GetServiceConfig() *ServiceConfig {
	return &ServiceConfig{
		smtpUser:  c.smtpUser,
		smtpPass:  c.smtpPass,
		smtpHost:  c.smtpHost,
		smtpPort:  c.smtpPort,
		apiUri:    c.apiUri,
		clientUri: c.clientUri,
	}
}

func (c *ServiceConfig) GetSmtpUser() string {
	return c.smtpUser
}

func (c *ServiceConfig) GetSmtpPass() string {
	return c.smtpPass
}

func (c *ServiceConfig) GetSmtpHost() string {
	return c.smtpHost
}

func (c *ServiceConfig) GetSmtpPort() string {
	return c.smtpPort
}

func (c *ServiceConfig) GetApiUri() string {
	return c.apiUri
}

func (c *ServiceConfig) GetClientUri() string {
	return c.clientUri
}
