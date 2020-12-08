


const dynamic="dynamic-v8";


// let questions=JSON.parse(localStorage.getItem("questions"));
// console.log(questions);


const limitSize=(name,size)=>{
    caches.open(name).then(cache=>{
        cache.keys().then(keys=>{
            
            if(keys.length>size){
               
                cache.delete(keys[0]).then(limitSize(name,size));
            };
        });
    });
};


self.addEventListener("install",evt=>{
  
});


self.addEventListener("activate",evt=>{
   evt.waitUntil(
       caches.keys().then(keys=>{
           console.log(keys);
          return Promise.all(keys.filter(key=>key!==dynamic ).map(key=>caches.delete(key)));
       })
   );
});


self.addEventListener("fetch",evt=>{
  
   evt.respondWith(
      
       caches.match(evt.request).then(cres=>{
           return cres || fetch(evt.request).then(fres=>{
               if(evt.request.url.indexOf("images/")!==-1){
                   console.log("xdfcgvb");
            return caches.open(dynamic).then(cache=>{
                cache.put(evt.request.url,fres.clone());
                limitSize(dynamic,75);
                return fres;
            })
        }else{
            return fres;
        }
        });
    
       })
    
   );
});

