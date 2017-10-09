export class Hivas {

   startOra: number;
   startMin: number;
   startSec: number;
   endOra: number;
   endMin: number;
   endSec: number;
   azon: string;
   constructor(sor: string) {
      this.azon = sor;
      const m: string[] = sor.split(" ");
      this.startOra = parseInt(m[0]);
      this.startMin = parseInt(m[1]);
      this.startSec = parseInt(m[2]);
      this.endOra = parseInt(m[3]);
      this.endMin = parseInt(m[4]);
      this.endSec = parseInt(m[5]);
   }
   /** A hívás időtartama másodpercben. */
   public hossz_mpbe(): number {
      const kezd: number = this.startSec + (this.startMin * 60) + (this.startOra * 3600);
      const bef: number = this.endSec + (this.endMin * 60) + (this.endOra * 3600);
      return bef - kezd;
   }
   public startSecbe(): number {
      return (this.startSec + (this.startMin * 60) + (this.startOra * 3600));
   }
   public endSecbe(): number {
      return (this.endSec + (this.endMin * 60) + (this.endOra * 3600));
   }
   public start(): string {
      return (`${this.startOra} ${this.startMin} ${this.startSec}`);
   }
   public end(): string {
      return (`${this.endOra} ${this.endMin} ${this.endSec}`);
   }
}

