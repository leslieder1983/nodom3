/**
 * NCache模块-存储在内存中
 */
export class NCache{
    private cacheData:any;

    constructor(){
        this.cacheData = {};
    }

    /**
     * 通过提供的键名从内存中拿到对应的值
     * @param key   键，支持"."（多级数据分割）
     * @reutrns     值或undefined
     */
    public get(key:string){
        let p = this.cacheData;
        if(key.indexOf('.') !== -1){
            let arr = key.split('.');
            if(arr.length>1){
                for(let i=0;i<arr.length-1 && p;i++){
                    p = p[arr[i]];
                }
                if(p){
                    key = arr[arr.length-1];
                }
            }
        }
        if(p){
            return p[key];
        }
    }

    /**
     * 通过提供的键名和值将其存储在内存中
     * @param key       键 
     * @param value     值
     */
    public set(key:string,value:any){
        let p = this.cacheData;
        if(key.indexOf('.') !== -1){
            let arr = key.split('.');
            if(arr.length>1){
                for(let i=0;i<arr.length-1;i++){
                    if(!p[arr[i]] || typeof p[arr[i]] !== 'object'){
                        p[arr[i]] = {};
                    }
                    p = p[arr[i]];        
                }
                key = arr[arr.length-1];
            }
        }
        
        if(p){
            p[key] = value;
        }
    }

    /**
     * 通过提供的键名将其移除
     * @param key   键 
     */
    public remove(key:string){
        let p = this.cacheData;
        if(key.indexOf('.') !== -1){
            let arr = key.split('.');
            if(arr.length>1){
                for(let i=0;i<arr.length-1 && p;i++){
                    p = p[arr[i]];
                }
                if(p){
                    key = arr[arr.length-1];
                }
            }
        }
        
        if(p){
            delete p[key];
        }       
    }
}