package config

type Config struct {
	mongoUri  string
	isDevMode bool
	smtpUser  string
	smtpPass  string
	smtpHost  string
	smtpPort  int
	apiUri    string
	clientUri string
}

func New(isDevMode bool, apiUri, clientUri string) *Config {
	return &Config{
		isDevMode: isDevMode,
		apiUri:    apiUri,
		clientUri: clientUri,
	}
}

func (c *Config) GetIsDevMode() bool {
	return c.isDevMode
}

func (c *Config) GetApiUri() string {
	return c.apiUri
}

func (c *Config) GetClientUri() string {
	return c.clientUri
}
