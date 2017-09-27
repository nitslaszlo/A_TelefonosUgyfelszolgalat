import * as http from "http";
import * as url from "url";
import * as fs from "fs";
import { Hivas } from "./hivas";

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
             const hindex: number = h.map((x) => x.azon).indexOf(i.azon);
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
        if(db === 0){
            res.write("Nem volt beszélő.</p>");
        } else {
            res.write("A várakozók száma: " + db + " a beszélő a " + (max + 1) + ". hívó.</p>");
        }  
        } else {
          res.write("A megadott időérték nem megfelelő, az 5. feladat nem értékelődött ki!</p>");
        }
        res.write("<p>6. feladat:<br>");
        input_mpbe = 43200;
        let utolsok: number[] = [];
        max = 0;
        const ws: fs.WriteStream = fs.createWriteStream("sikeres.txt");
        h.forEach((i) => {
            const hindex: number = h.map((x) => x.azon).indexOf(i.azon);
            if (h[hindex].k_mpbe() < 43200 && h[hindex].v_mpbe() > 28800) {
                if (utolsok[1] === undefined) {
                    utolsok[1] = hindex;
                    if (h[hindex].k_mpbe() < 28800){ 
                        ws.write(`${hindex+1} 8 0 0 ${h[hindex].v()}\r\n`);
                    }else{
                        ws.write(`${hindex+1} ${h[hindex].azon}\r\n`);                     
                    }
                } else {
                     if (h[utolsok[1]].v_mpbe() <= h[hindex].v_mpbe()){
                        utolsok[0] = utolsok[1];
                        utolsok[1] = hindex;
                        if (h[utolsok[1]].k_mpbe() < h[utolsok[0]].v_mpbe()){
                            ws.write(`${hindex+1} ${h[utolsok[0]].v()} ${h[hindex].v()}\r\n`);
                        } else {
                            ws.write(`${hindex+1} ${h[hindex].azon}\r\n`);
                        }
                    }
                }
            }
        });
        ws.end();
        let varakozas: number = h[utolsok[0]].v_mpbe() - h[utolsok[1]].k_mpbe();
        if (((h[utolsok[0]].v_mpbe()) - (h[utolsok[1]].k_mpbe())) < 0){ 
            varakozas = 0;
         }
        res.write(`Az utolsó telefonáló adatai a(z) ${utolsok[1] + 1}. sorban vannak, ${varakozas} mp-ig várt.</p> `);
        res.write("</p><input type='submit' value='Frissítés'></pre></form>");
        res.end();
    }
}

