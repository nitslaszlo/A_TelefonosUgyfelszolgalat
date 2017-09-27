export class Hivas {

   k_ora: number;
   k_perc: number;
   k_mperc: number;
   v_ora: number;
   v_perc: number;
   v_mperc: number;
   azon: string;
   constructor(sor: string) {
      this.azon = sor;
      const m: string[] = sor.split(" ");
      this.k_ora = parseInt(m[0]);
      this.k_perc = parseInt(m[1]);
      this.k_mperc = parseInt(m[2]);
      this.v_ora = parseInt(m[3]);
      this.v_perc = parseInt(m[4]);
      this.v_mperc = parseInt(m[5]);
   }
   /** A hívás időtartama másodpercben. */
   public hossz_mpbe(): number {
      const kezd: number = this.k_mperc + (this.k_perc * 60) + (this.k_ora * 60 * 60);
      const bef: number = this.v_mperc + (this.v_perc * 60) + (this.v_ora * 60 * 60);
      return bef - kezd;
   }
   public k_mpbe(): number {
      return (this.k_mperc + (this.k_perc * 60) + (this.k_ora * 60 * 60));
   }
   public v_mpbe(): number {
      return (this.v_mperc + (this.v_perc * 60) + (this.v_ora * 60 * 60));
   }
   public k(): string {
      return (`${this.k_ora} ${this.k_perc} ${this.k_mperc}`);
   }
   public v(): string {
      return (`${this.v_ora} ${this.v_perc} ${this.v_mperc}`);
   }
}

