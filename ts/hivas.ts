export class Hivas {

   k_ora: number;
   k_perc: number;
   k_mperc: number;
   v_ora: number;
   v_perc: number;
   v_mperc: number;

   constructor(sor: string) {
      const m: string[] = sor.split(" ");
      this.k_ora = parseInt(m[0]);
      this.k_perc = parseInt(m[1]);
      this.k_mperc = parseInt(m[2]);
      this.v_ora = parseInt(m[3]);
      this.v_perc = parseInt(m[4]);
      this.v_mperc = parseInt(m[5]);
   }
   /** A hívás időtartama másodpercben. */
   public mpbe(): number {
      const kezd: number = this.k_mperc + (this.k_perc * 60) + (this.k_ora * 60 * 60);
      const bef: number = this.v_mperc + (this.v_perc * 60) + (this.v_ora * 60 * 60);
      return bef - kezd;
   }
}

