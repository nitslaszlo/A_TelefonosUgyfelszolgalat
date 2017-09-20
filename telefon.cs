using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Erettsegi33_Telefonos_ügyfélszolgálat
{
    class Hívás
    {
        public int Ssz { get; set; }
        public DateTime Hív { get; set; }
        public DateTime? Fogad { get; set; } //null érték jelzi, ha nem fogadták a hívást
        public DateTime Letesz { get; set; }

        public Hívás(int ssz, string sor)
        {
            Ssz = ssz;
            string[] m = sor.Split();
            Hív = DateTime.Parse($"{m[0]}:{m[1]}:{m[2]}");
            Letesz = DateTime.Parse($"{m[3]}:{m[4]}:{m[5]}");
            Fogad = null;
        }

        public bool Munkaidős => Letesz > DateTime.Parse("0:0:0").AddSeconds(mpbe(8, 0, 0)) && Hív < DateTime.Parse("0:0:0").AddSeconds(mpbe(12, 0, 0));

        public int Hossz => (int)(Letesz - Hív).TotalSeconds;

        public bool Fogadott => Fogad != null;

        public int Várt => Fogadott ? (int)((DateTime)Fogad - Hív).TotalSeconds : Hossz;

        public override string ToString()
        {
            if (Fogadott) return $"{Ssz} {((DateTime)(Fogad)).ToString("h m s")} {Letesz.ToString("h m s")}";
            else return base.ToString();
        }

        public int mpbe(int o, int p, int mp) => o * 3600 + p * 60 + mp;
    }

    class telefon
    {
        static void Main()
        {
            List<Hívás> h = new List<Hívás>();
            DateTime? utolsótLetesz = null; //ügyfélszolgálatos mikor fogja letenni a szerencsés hívót
            foreach (var i in File.ReadAllLines("hivas.txt"))
            {
                Hívás aktHívás = new Hívás(h.Count + 1, i);
                if (aktHívás.Munkaidős)
                {
                    if (utolsótLetesz == null) //első munkaidős hívás?
                    {
                        aktHívás.Fogad = aktHívás.Hív;
                        utolsótLetesz = aktHívás.Letesz;
                    }
                    else if (utolsótLetesz < aktHívás.Letesz) //ha fogadják a hívást
                    {
                        aktHívás.Fogad = (DateTime)utolsótLetesz > aktHívás.Hív ? (DateTime)utolsótLetesz : aktHívás.Hív; //többi fogadott hívás
                        utolsótLetesz = aktHívás.Letesz;
                    }
                }
                h.Add(aktHívás);
            }

            Console.WriteLine(h.GroupBy(g => g.Hív.Hour).Aggregate("3. feladat\n", (c, n) => c + $"{n.Key} óra {n.Count()} hívás\n"));

            Hívás maxHossz = h.OrderByDescending(x => x.Hossz).First();
            Console.WriteLine($"4.feladat\nA leghosszabb ideig vonalban lévő hívó {maxHossz.Ssz}.sorban szerepel,\n a hivas hossza: {maxHossz.Hossz} másodperc.");

            Console.Write("5. feladat\nAdjon meg egy időpontot (óra perc másodperc) ");
            DateTime inputIdő = DateTime.Parse(Console.ReadLine().Replace(' ', ':'));
            var munkaidőbenVárnak = h.Where(x => x.Munkaidős && x.Hív <= inputIdő && x.Letesz > inputIdő);
            if (munkaidőbenVárnak.Count() > 0) Console.WriteLine($"A várakozók száma: {munkaidőbenVárnak.Count() - 1} a beszélő a {munkaidőbenVárnak.First().Ssz}. hívó.");
            else Console.WriteLine($"Nem volt beszélő.");

            var utolsó = h.Where(x => x.Fogadott).OrderByDescending(x => x.Hív).First();
            Console.WriteLine($"6. feladat\nAz utolsó telefonáló adatai a(z) {utolsó.Ssz}. sorban vannak, {utolsó.Várt} másodpercig várt.");

            File.WriteAllText("sikeres.txt", h.Where(x => x.Fogadott).Aggregate("", (c, n) => c += n + "\n"));

            Console.ReadKey();
        }
    }
}