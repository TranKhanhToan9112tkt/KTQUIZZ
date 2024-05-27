import useTitle from 'hooks/useTitle';
import Typography from "@material-ui/core/Typography";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import React, { useState, useEffect } from 'react';
import grammarApi from '../apis/grammarApi';
import { useHistory, useParams } from 'react-router';
import { cloudinaryImgOptimize } from "helper";
import { DEFAULTS } from 'constants/index';
import { makeStyles } from "@material-ui/core";
import { Link } from 'react-router-dom';
import { store } from 'redux/store';
// import { updateGrammarLockStatus } from 'apis/grammarApi';


const useStyle = makeStyles(() => ({
  mobilelist : {
    height: "115px",
},
  LockItem : {
    opacity: "0.6",
    pointerEvents: "none",
},
  ActiveItem : {
    opacity: "1",
    pointerEvents: "auto",
},
floatleft: {
  float: "left",
  margin: "0 10px 10px 0px",
  padding: "2px",
},
title: {
  display: 'inline-block',
  fontSize: '2.0rem',
  fontWeight: 400,
  color: 'blue',
  margin: '0.8rem 0rem 0rem 0',

  '&:hover, &:focus': {
    color: "#CCC",
  },

},
tldetail: {
  fontSize: '1.5rem',
  fontWeight:400,
  color: 'black', 
},
textlimit: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  width: "500px",
}

}));

function GrammarByLevelPage() {
  useTitle('Grammar');
  const [list, setList] = useState([]);
  const classes= useStyle();
  const history = useHistory();
  const  level = useParams().level;
  let grammarId = "";
  let correctAnswersCount = 0;
  //
  const savedGrammarId = localStorage.getItem("grammarId");
  const savedCorrectAnswers = localStorage.getItem("correctAnswers");
  if (savedGrammarId && savedCorrectAnswers) {
    grammarId = savedGrammarId;
    correctAnswersCount = parseInt(savedCorrectAnswers);
  } else {
    console.log("không tìm thấy grammarId và correctanswer")
  }
  console.log(grammarId)
  console.log(correctAnswersCount)
  //
  // let grammarId1 = '';
  useEffect(() => {
    (async function () {
      try {
        const apiRes = await grammarApi.getGrammarByLevel(level);
        if (apiRes.status === 200) {
          console.log(apiRes.data);
          apiRes.data.grammars[0].isLocked = 1
          const newList = [...apiRes.data.grammars]; // Tạo một bản sao của danh sách
          setList(newList); // Cập nhật trạng thái của danh sách
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

 // Tìm chỉ mục của grammarId trong danh sách
 console.log(list);
 const indexGrammar = list.findIndex(item => item._id === grammarId) + 1;

 
 console.log(indexGrammar);
 const unlockItem = 1;
 let storeUnlock = [];
 if (indexGrammar !== -1 && indexGrammar && correctAnswersCount > 3) {
   console.log(`Tìm thấy grammarId trong danh sách tại chỉ mục ${indexGrammar}`);
   list[indexGrammar].isLocked = unlockItem;
   storeUnlock = { id: list[indexGrammar]._id, unlockItem: 1 };
   const storedStoreUnlockJSON = localStorage.getItem('storeUnlock');
   const storedStoreUnlock = storedStoreUnlockJSON ? JSON.parse(storedStoreUnlockJSON) : [];
 
   // Kiểm tra xem id đã tồn tại trong mảng storedStoreUnlock hay chưa
   const isIdExists = storedStoreUnlock.some(item => item.id === storeUnlock.id);
 
   // Nếu id không tồn tại, thêm storeUnlock vào mảng updatedStoreUnlock
   if (!isIdExists) {
     const updatedStoreUnlock = [...storedStoreUnlock, storeUnlock];
 
     // Lưu mảng đã kết hợp vào local storage
     localStorage.setItem('storeUnlock', JSON.stringify(updatedStoreUnlock));
   }
   
   // Lặp qua từng item trong list và gắn isLocked
   for (let i = 0; i < list.length; i++) {
     const currentItem = list[i];
     const currentItemID = currentItem._id;
 
     // Kiểm tra xem id của item có trong mảng storedStoreUnlock không
     const foundUnlock = storedStoreUnlock.find(item => item.id === currentItemID);
 
     // Nếu id được tìm thấy trong mảng storedStoreUnlock, gắn isLocked cho item
     if (foundUnlock) {
       currentItem.isLocked = foundUnlock.unlockItem;
     }
   }
   
  //  console.log(list);
 }


 const getImage = (image) =>{
    const imgSrc = cloudinaryImgOptimize( image ? image : DEFAULTS.IMAGE_SRC,
         200,
         200,
         true,
         true
     );
     return imgSrc;
}

const viewDetail=(id)=>{
    history.push(`/grammar/details/${id}`)
}

// const handleItemClick = (index) => {
//   setSelectedIndex(index); // Cập nhật index của mục được chọn
//   // Thay đổi class của phần tử ở index tiếp theo
//   if (index < list.length - 1) {
//     const nextIndex = index + 1;
//     const nextItem = document.getElementsByClassName(classes.LockItem)[nextIndex];
//     if (nextItem) {
//       nextItem.classList.remove(classes.LockItem);
//       nextItem.classList.add(classes.ActiveItem);
//     }
//   }
//   console.log(selectedIndex)
// }

  return (
      <><Typography variant="h6" align="center">
      Level {level}
    </Typography>
    <div className="container" style={{ position: "relative", left: "250px" }}>
        {list && (
          list.map((item, index) => <div className={classes.mobilelist} key={index}>
            <div className={item.isLocked === 1 ? classes.ActiveItem : classes.LockItem}>
            <Link to={`/grammar/details/${item._id}`}>
              <div className={classes.floatleft}>               
                  <img height="80px" width="80px" src={getImage(item.Image)}/>               
                </div>
                  <p className={classes.title}><strong> {item.Title}</strong></p>
                  <br></br>
                  </Link>
                <div className={classes.textlimit}>
                  <span className={classes.tldetail}>{item.Content}</span>
                </div>
              </div>

            </div>
          ))}
          
         </div> </>
  );
        }

export default GrammarByLevelPage;