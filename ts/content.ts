import * as http from "http";
import * as url from "url"; // űrlapokhoz, input kiolvasás
import * as fs from "fs"; // file-kezelés
import { Hivas } from "./hivas";

function mpbe(ora: number, perc: number, mperc: number): number {
    const sec: number = mperc + (60 * perc) + (60 * 60 * ora);
    return sec;
}

export class Content {
    Content(req: http.ServerRequest, res: http.ServerResponse): void {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<p>Hello TypeScript!!!</p>");
        res.write(`<p>${mpbe(1, 10, 10)}</p>`);
        const h: Hivas[] = [];
        const sorok: string[] = fs.readFileSync("hivas.txt").toString().split("\r\n");
        sorok.forEach((i) => {
            if (i.length > 0) h.push(new Hivas(i));
        });
        const hivasdarab: number[] = [];
         h.forEach((i) => {
            const hindex: number = h.map((x) => x.k_ora).indexOf(i.k_ora);
            if (hivasdarab[h[hindex].k_ora] === undefined) {
               hivasdarab[h[hindex].k_ora] = 1 ;
            }else{
                hivasdarab[h[hindex].k_ora]++;
            }
        });
         for (let i = 0; i < 24; i++) { 
             if (hivasdarab[i] !== undefined) {
                 res.write(`<p>${i} => ${hivasdarab[i]}</p>`);
             }
         }
        res.end();
    }
}

