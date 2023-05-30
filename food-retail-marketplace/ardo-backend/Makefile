include .env
export
run:
	go run cmd/i18n/gen.go --csv errors.csv --out pkg/core/i18ngen.go --pkg core
	cd cmd/api && go run main.go

i18n:
	go run cmd/i18n/gen.go --csv errors.csv --out pkg/core/i18ngen.go --pkg core