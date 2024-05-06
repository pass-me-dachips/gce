
class Env {
  constructor() {
      this.table = [];
  }
 add(key,proc) {
   const inTable = this.table.find(variable => key === variable.key);
   if (inTable) return { SIG: "EXISTS" };
   else this.table.push({key, proc}); return { SIG: "ACK" };    
  }
 remove(key) {
   this.table = this.table.filter(variable => variable.key !== key);
   return { SIG: "ACK" };    
 }
 get(key) {
   const variable = this.table.find(variable => key === variable.key);
   if (variable) return { SIG: "HASPAYLOAD", payload: variable };
   else return { SIG: "NONE" }; 
 }
 getAll() {
   return { SIG: "HASPAYLOAD", payload: this.table }; 
 }
 static EnvInstance() {
   if (!Env.instance) Env.instance = new Env();
   return Env.instance;
 }
}

const Cache = Env.EnvInstance();

export default Cache;
