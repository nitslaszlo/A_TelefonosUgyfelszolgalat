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
        const query: any = url.parse(req.url, true).query;
        const idopont: string = query.idopont === undefined ? "08 10 00" : query.idopont;
        res.write("<p>Hello TypeScript!!!</p>");
        res.write(`<p>${mpbe(1, 10, 10)}</p>`);
        const h: Hivas[] = [];
        const sorok: string[] = fs.readFileSync("hivas.txt").toString().split("\r\n");
        sorok.forEach((i) => {
            if (i.length > 0) h.push(new Hivas(i));
        });
        const hivasdarab: number[] = [];
        const max: number[] = [0, 0];
         h.forEach((i) => {
             const hindex: number = h.map((x) => x.k_ora).indexOf(i.k_ora);

             if (h[max[0]].mpbe() < h[hindex].mpbe()) {
                 max[0] = hindex;
             }
             if (hivasdarab[h[hindex].k_ora] === undefined) {
               hivasdarab[h[hindex].k_ora] = 1 ;
            }else {
                hivasdarab[h[hindex].k_ora]++;
            }
        });
         for (let i: number = 0; i < 24; i++) {
             if (hivasdarab[i] !== undefined) {
                 res.write(`<p>${i} óra ${hivasdarab[i]} hívás</p>`);
             }
         }
         res.write(`<p>A ${max[0] + 1}. hívás volt a leghosszabb: ${h[max[0]].mpbe()} mp</p>`);
        /* res.write("<p>3. feladat: A versenyző azonosítója = <input type='text' " +
             "name= 'idopont' style= 'font-family:Courier; font - size: inherit; " +
             "background:LightGray;' value='" + idopont + "'><br>");
         let tmp: Hivas;
         const input: Hivas = new Hivas(idopont);
         for (let i: number = 0; i < v.length; i++) {
             if (h[i].vk === vazon) { tmp = v[i]; break; }
         }

         if (tmp === undefined) { res.write(); }
         res.write(`${tmp.vv} (a versenyző válasza)</p>`);*/
        res.end();
    }
}

