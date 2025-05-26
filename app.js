


const cl = console.log;
        
          const stdForm=document.getElementById("stdForm")
        const fnameControl=document.getElementById("fname")
        const lnameControl=document.getElementById("lname")
        const emailControl=document.getElementById("email")
        const wieghtControl=document.getElementById("wieght")
        const hieghtControl=document.getElementById("hieght")
        const requirePackageControl=document.getElementById("requirePackage")
        const impControl=document.getElementById("imp")
        const entryDateControl=document.getElementById("entryDate")
        const stdConatiner=document.getElementById("stdConatiner")
        const addCandidate=document.getElementById("addCandidate");
        const upCandidate=document.getElementById("upCandidate")

        const loader=document.getElementById("loader")


          base_URl=`https://fetch-table-firebase-default-rtdb.firebaseio.com`
          post_URl=`${base_URl}/students.json`

           const snackBar = (msg, icon)=>{
             swal.fire({
                title:msg,
                icon:icon,
                timer:3000

             })
           }


           const onEdit = async (ele) =>{
              let editID=ele.closest("tr").id;
              cl(editID)

              localStorage.setItem("editID", editID)

              edit_URL=`${base_URl}/students/${editID}.json`

              let res= await makeApiCall(edit_URL, "GET")
              cl(res)

              if(res){
                 fnameControl.value=res.fName;
                 lnameControl.value=res.lName;
                 emailControl.value=res.email;
                 wieghtControl.value=res.weight;
                 hieghtControl.value=res.height;
                 document.querySelectorAll("input[name='gender']").forEach(rd=>{rd.checked=rd.value===res.gender})
                 document.querySelectorAll("input[name='reqireTrainer']").forEach(rd=>{rd.checked=rd.value===res.reqireTrainer});
                 requirePackageControl.value=res.requirePackage;
                 impControl.value=res.imp;
                 entryDateControl.value=res.entryDate
                  upCandidate.classList.remove("d-none")
                  addCandidate.classList.add("d-none")

              }

           }

           const onRemove = async(ele) =>{
              let result = await Swal.fire({
                                title: "Do you want to Remove this candidate",
                                showCancelButton: true,
                                confirmButtonText: "Remove",
                             })

                             if(result.isConfirmed){
                                 removeID=ele.closest("tr").id;
                                 cl(removeID)

                                 remove_URl=`${base_URl}/students/${removeID}.json`

                                 let res= await makeApiCall(remove_URl, "DELETE")
                                 ele.closest("tr").remove()
                                 snackBar(`a Candidate with ${removeID} id remove successfully`, "success")
                             }
                                        }



           const createtable=(arr)=>{
              let result="";
               arr.forEach((std, i)=>{
                 result+=`
                                   <tr id="${std.id}">
                                    <td>${i+1}</td>
                                     <td>${std.fName}</td>
                                     <td>${std.lName}</td>
                                     <td>${std.email}</td>
                                     <td>${std.weight}</td>
                                     <td>${std.height}</td>
                                     <td>${std.gender}</td>
                                     <td>${std.requireTrainer}</td>
                                     <td>${std.requirePackage}</td>
                                     <td>${std.imp}</td>
                                     <td>${std.entryDate}</td>
                                     <td class="text-center"><i class="fa-solid fa-pen-to-square text-success" onClick="onEdit(this)"></i></td>
                                     <td class="text-center"><i class="fa-solid fa-trash-can text-danger" onClick="onRemove(this)"></i></td>
                                    </tr>
                 
                 
                 
                 
                 `
                 
               })
                stdConatiner.innerHTML=result;
           }

             

             const makeApiCall = async(url, methodName, msgBody)=>{
                  try{
                        msgBody=msgBody? JSON.stringify(msgBody) : null;
                         loader.classList.remove("d-none")
                         let res= await fetch(url,{
                            method:methodName,
                            body:msgBody,
                            headers:{
                                Authorization:"Token",
                                "Content-type":"application/json"
                            }
                        })
                        return res.json()
                  } 
                  catch(err){
                     snackBar("something went wrong", "error")
                  } finally{
                    loader.classList.add("d-none")
                  }  
             }


              const objToarr = (obj)=>{
                  let arr=[]
                  for (const key in obj) {
                    arr.push({...obj[key], id:key})
                  }
                  return arr;
              }


              stdArr=[]

             const fetChData = async()=>{
                let res= await makeApiCall(post_URl, "GET")
                cl(res)
                stdArr=objToarr(res)
                createtable(stdArr)
             }

             fetChData()

           




         const onAdd= async(eve)=>{
            eve.preventDefault()

            const genderControl=document.querySelector("input[name='gender']:checked")
            const reqireTrainerControl=document.querySelector("input[name='reqireTrainer']:checked")

            let stdObj={
                    fName:fnameControl.value,
                    lName:lnameControl.value,
                    email:emailControl.value,
                   weight:wieghtControl.value,
                    height: hieghtControl.value,
                    gender:genderControl? genderControl.value:"",
                    requireTrainer: reqireTrainerControl? reqireTrainerControl.value:"",
                    requirePackage:requirePackageControl.value,
                    imp:impControl.value,
                    entryDate:entryDateControl.value,
            }

            stdForm.reset()

             let res= await makeApiCall(post_URl, "POST", stdObj )

             let tr= document.createElement("tr");
             tr.id=res.name
            //  let numtr=
             tr.innerHTML=`
                                    <td>${res.length}</td>
                                     <td>${stdObj.fName}</td>
                                     <td>${stdObj.lName}</td>
                                     <td>${stdObj.email}</td>
                                     <td>${stdObj.weight}</td>
                                     <td>${stdObj.height}</td>
                                     <td>${stdObj.gender}</td>
                                     <td>${stdObj.requireTrainer}</td>
                                     <td>${stdObj.requirePackage}</td>
                                     <td>${stdObj.imp}</td>
                                     <td>${stdObj.entryDate}</td>
                                     <td class="text-center"><i class="fa-solid fa-pen-to-square text-success" onClick="onEdit(this)"></i></td>
                                     <td class="text-center"><i class="fa-solid fa-trash-can text-danger" onClick="onRemove(this)"></i></td>
             
             
             
             `
              stdConatiner.append(tr);
              snackBar(`new candidate added successfully!!`, "success")
            
        }


         const onupdate = async() =>{
              let updateID=localStorage.getItem("editID")   
               
               const genderControl=document.querySelector("input[name='gender']:checked")
            const reqireTrainerControl=document.querySelector("input[name='reqireTrainer']:checked")

              let updateObj={
                 fName:fnameControl.value,
                    lName:lnameControl.value,
                    email:emailControl.value,
                   weight:wieghtControl.value,
                    height: hieghtControl.value,
                    gender:genderControl? genderControl.value:"",
                    requireTrainer:reqireTrainerControl? reqireTrainerControl.value:"",
                    requirePackage:requirePackageControl.value,
                    imp:impControl.value,
                    entryDate:entryDateControl.value,
              }

              stdForm.reset()

              let update_URL=`${base_URl}/students/${updateID}.json`

              let res= await makeApiCall(update_URL, "PATCH", updateObj )

              let tr=document.getElementById(updateID).children;

              tr[1].innerHTML=updateObj.fName
              tr[2].innerHTML=updateObj.lName;
              tr[3].innerHTML=updateObj.email
              tr[4].innerHTML=updateObj.weight;
              tr[5].innerHTML=updateObj.height;
              tr[6].innerHTML=updateObj.gender
              tr[7].innerHTML=updateObj.requireTrainer;
              tr[8].innerHTML=updateObj.requirePackage;
              tr[9].innerHTML=updateObj.imp;
              tr[10].innerHTML=updateObj.entryDate;
    
              upCandidate.classList.add("d-none")
                  addCandidate.classList.remove("d-none")
              snackBar(`A candidate with ${updateID} id updated successfully!!`, "success")
         }




         upCandidate.addEventListener("click", onupdate)
        stdForm.addEventListener("submit", onAdd)