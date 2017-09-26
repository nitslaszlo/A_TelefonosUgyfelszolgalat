import * as http from "http";
import * as url from "url"; // űrlapokhoz, input kiolvasás
import * as fs from "fs"; // file-kezelés
import { Hivas } from "./hivas";

function del(index: number, array: number[]): number[] {
  array[index] = undefined;
  for (let i: number = index; i < array.length; i++){
    array[i] = array[i + 1];
  }
  array[array.length - 1] = undefined;
        return array;
}
function hozzaad(mit: number, mihez: number[]): number[]{
  mihez[1] = mihez[0];
  mihez[0] = mit;
  return mihez;
}

export class Content {
    Content(req: http.ServerRequest, res: http.ServerResponse): void {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<form style='font-size:16px; background: LightGray'>");
        res.write("<pre style='font-family: Courier'>");
        res.write("<p>1. feladat: Az adatok beolvasása</p>");
        const query: any = url.parse(req.url, true).query;
        const idopont: string = query.idopont === undefined ? "08 10 00" : query.idopont;
        const h: Hivas[] = [];
        const sorok: string[] = fs.readFileSync("hivas.txt").toString().split("\r\n");
        sorok.forEach((i) => {
            if (i.length > 0) h.push(new Hivas(i));
        });
        res.write("<p>2. feladat: mpbe metódus hozzáadva a Hívás osztályhoz.</p>");
        res.write("<p>3. feladat:<br>");
        const hivasdarab: number[] = [];
        let max: number[] = [0, 0];
         h.forEach((i) => {
             const hindex: number = h.map((x) => x.k_ora).indexOf(i.k_ora);
             if (h[max[0]].hossz_mpbe() < h[hindex].hossz_mpbe()) {
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
                 res.write(`<br>${i} óra ${hivasdarab[i]} hívás`);
             }
         }
         res.write("</p><p>4. feladat:<br>");
         res.write(`A ${max[0] + 1}. hívás volt a leghosszabb: ${h[max[0]].hossz_mpbe()} mp</p>`);
        res.write("<p>5. feladat: Kérek egy időpontot (ó p mp) = <input type='text' " +
             "name= 'idopont' style= 'font-family:Courier; font - size: inherit; " +
             "background:LightGray;' value='" + idopont + "'><br>");
        let tmp: Hivas;
        const m: string[] = idopont.split(" ");
        const input: number[] = [];
        let input_mpbe: number = 0;
        for (let i: number = 0; i < m.length; i++) {
            input[i] = parseInt(m[i]);
            input_mpbe += input[i] * Math.pow(60, 2 - i);
        }
        let folyamatban: number[] = [];
        folyamatban[0] = 0;
                          // folyamatban
        if (input_mpbe >= 28800 && input_mpbe <= 43200) {
            let max: number = 0;
            let db: number = 0;    
        h.forEach((i) => {
            const hindex: number = h.map((x) => x.azon).indexOf(i.azon);
            if (h[hindex].v_mpbe() > input_mpbe && h[hindex].k_mpbe() < input_mpbe) {
                if (max === 0) {
                  max = hindex;
              } else {
                  if(h[hindex].v_mpbe() > h[max].v_mpbe()){
                    max = hindex;
                  }
                }
                db++;  
              folyamatban[folyamatban.length] = hindex;
            }
        });
        res.write("A várakozók száma: "+ db +" a beszélő a " + (max+1) + ". hívó.</p>");    
        /*for (i; i < folyamatban.length; i++){
            const hindex: number = h.map((x) => x.azon).indexOf(folyamatban[i].azon);
            const maxindex: number = h.map((x) => x.azon).indexOf(folyamatban[max].azon);
            if(h[hindex].v_mpben() > h[folyamatban[maxindex].v_mpben()) {
              max = hindex;
            }
        }*/
        } else {
          res.write("A megadott időérték nem megfelelő, az 5. feladat nem értékelődött ki!</p>");
        }
                   res.write("</p><input type='submit' value='Frissítés'></pre></form>");
        res.end();
    }
}

