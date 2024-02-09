package config

type Config struct {
	mongoUri    string
	isDevMode   bool
	emailCfg    *CfgEmail
	apiUri      string
	clientUri   string
	spaceKey    string
	spaceSecret string
}

func New(isDevMode bool, smtpPort int, smtpUser, smtpPass, smtpHost, mongoUri, apiUri, clientUri, spaceKey, spaceSecret string) *Config {
	return &Config{
		mongoUri:    mongoUri,
		isDevMode:   isDevMode,
		emailCfg:    NewCfgEmail(int64(smtpPort), smtpUser, smtpPass, smtpHost),
		apiUri:      apiUri,
		clientUri:   clientUri,
		spaceKey:    spaceKey,
		spaceSecret: spaceSecret,
	}
}

func (c *Config) GetMongoUri() string {
	return c.mongoUri
}

func (c *Config) GetIsDevMode() bool {
	return c.isDevMode
}

func (c *Config) GetEmailCfg() *CfgEmail {
	return c.emailCfg
}

func (c *Config) GetApiUri() string {
	return c.apiUri
}

func (c *Config) GetClientUri() string {
	return c.clientUri
}

func (c *Config) GetSpaceKey() string {
	return c.spaceKey
}

func (c *Config) GetSpaceSecret() string {
	return c.spaceSecret
}

type CfgEmail struct {
	smtpUser string
	smtpPass string
	smtpHost string
	smtpPort int64
}

func NewCfgEmail(smtpPort int64, smtpUser, smtpPass, smtpHost string) *CfgEmail {
	return &CfgEmail{
		smtpUser: smtpUser,
		smtpPass: smtpPass,
		smtpHost: smtpHost,
		smtpPort: smtpPort,
	}
}

func (c *CfgEmail) GetSmtpUser() string {
	return c.smtpUser
}

func (c *CfgEmail) GetSmtpPass() string {
	return c.smtpPass
}

func (c *CfgEmail) GetSmtpHost() string {
	return c.smtpHost
}

func (c *CfgEmail) GetSmtpPort() int64 {
	return c.smtpPort
}
