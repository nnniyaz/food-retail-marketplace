import path from "path";
import {parse} from "csv-parse";
import fs from "fs";

function TxtGen() {
    const csvFilePath = path.resolve(".", './txtmaps.csv');

    const headers = ["key", "RU", "KZ", "EN", "TR", "AZ", "CH", "JP", "AR", "UZ", "ID", "KY", "UK"];

    const fileContent = fs.readFileSync(csvFilePath, {encoding: 'utf-8'});

    console.log("generate txts");

    parse(fileContent, {
        delimiter: ',',
        columns: headers,
    }, (error, result) => {
        if (error) {
            console.error(error);
            process.exit(1)
        }
        let txtMap = {}
        result.forEach((v) => {
            txtMap[v.key] = v
        })
        fs.writeFile(
            "./src/pkg/core/txts.ts",
            "import {MlString} from '../../domain/base/mlString.ts';\n\nexport const txts: {[key: string]: MlString} = " + JSON.stringify(txtMap),
            (err) => {
                if (err != null) {
                    console.log("error write to txt.json", err)
                    process.exit(1)
                }
            }
        )
    })
}

TxtGen()
