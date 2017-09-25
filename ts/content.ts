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
        let max: number[] = [0,0];
        let kul: number = 0;
         h.forEach((i) => {
             const hindex: number = h.map((x) => x.k_ora).indexOf(i.k_ora);
             if (max[0]==0){ 
                 max[0] = mpbe(h[hindex].v_ora, h[hindex].v_perc, h[hindex].v_mperc) - mpbe(h[hindex].k_ora, h[hindex].k_perc, h[hindex].k_mperc);
             } else {
                kul = mpbe(h[hindex].v_ora, h[hindex].v_perc, h[hindex].v_mperc) - mpbe(h[hindex].k_ora, h[hindex].k_perc, h[hindex].k_mperc);
                if (kul > max[0]) { 
                    max[0] = kul;
                    max[1]= hindex;
                }
             }
             if(hivasdarab[h[hindex].k_ora] === undefined) {
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
         res.write(`<p>A ${max[1]}. hívás volt a leghosszabb: ${max[0]} mp</p>`);
        res.end();
    }
}

