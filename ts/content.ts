﻿import * as http from "http";
import * as url from "url"; // űrlapokhoz, input kiolvasás
import * as fs from "fs"; // file-kezelés

export class Content {

    Content(req: http.ServerRequest, res: http.ServerResponse): void {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<p>Hello TypeScript!!!</p>");
        res.write("Dragon voltam~");
        res.write("Megint");
        res.write("Hol iratkozok ki");
        res.write("az");
        res.write("Még mindig jó? -M.Á.");
        res.end();
    }
}

