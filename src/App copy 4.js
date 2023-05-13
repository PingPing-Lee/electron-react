
import React from 'react'; 
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from "react-simplemde-editor";
import { v4 as uuidv4 } from 'uuid';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "easymde/dist/easymde.min.css";

import FileSearch from './ components/FileSearch';
import FileList from './ components/FileList';
import BottomBtn from './ components/BottomBtn';
import TabList from './ components/TabList';
import defaultFiles from './utils/defaultFiles';
import { useState } from 'react/cjs/react.development';

import { flattenArr, objToArr } from './utils/helper'

// const onChange = useCallback((value: string) => {
//   setValue(value);
// }, []);

function App() {
  const [ files, setFiles ] = useState(flattenArr(defaultFiles))
  console.log('files', files);

  const [ activeFileID, setActiveFileID ] =useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIDs, setUnsavedFileIDs ] = useState([])
  const [ searchedFiles, setSearchedFiles ] = useState([])
  // const [ isLoading, setLoading ] = useState(false)
  const filesArr = objToArr(files)
  console.log('filesArr', filesArr);
  // const savedLocation = settingsStore.get('savedFileLocation') || remote.app.getPath('documents')
  const activeFile = files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr

  // 左侧文件列表点击，右侧打开
  const fileClick = (fileID) => {
    // 设置当前 Active File
    setActiveFileID(fileID)
    // 如果 OpenedFile 没有当前ID，则向OpenedFile添加新的文件ID
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([ ...openedFileIDs, fileID ])
    }   
  }
  // 切换 tab
  const tabClick = (fileID) => {
    // 设置当前 Active File
    setActiveFileID(fileID)
  }
  // 关闭 tab
  const tabClose = (fileID) => {
    //  删除当前 openedFileIDs 的 fileID
    const tabsWithout = openedFileIDs.filter(id => id !== fileID)
    setOpenedFileIDs(tabsWithout)
    // 如果当前删除的 tab 是 activeID，则选中的 activeID 向前移动一个
    if (fileID === activeFileID){
      const index = openedFileIDs.findIndex(id => id === fileID)
      // 除去要关闭的这个 tab， 还有其他 tab
      if (tabsWithout.length > 0) {
        // 当前删除的是第一个, 则第二个被选中
        if (tabsWithout[index]) { // 有 index， 则 index 被选中
          setActiveFileID(tabsWithout[index])
        } else if (tabsWithout[index - 1]) { // 有 index-1， 则 index-1 被选中
          setActiveFileID(tabsWithout[index - 1])
        }
      } else { // 只有当前要删除的 tab，删除之后则清空 tab
        setActiveFileID('')
      }
    } 
  }
  // 文件的内容、文件名称被更新时
  const fileChange = (fileID, value, key = 'title', unsaved = false, isNew = false) => {
    const currFile = files[fileID];
    console.log(currFile[key], fileID, value, key)

    // 如果当前内容和 文件内容不一样， 
    if (currFile[key] !== value) {
      // 设置当前 files
      const newFile = { ...currFile, [key]: value, isNew: false };
      setFiles({ ...files, [fileID]: newFile });
      // 打开文件名称更改时，同步 tab
      if (openedFileIDs.includes(fileID)) {
        setOpenedFileIDs([ ...openedFileIDs ])
      } 
      // 如果当前文件未被保存
      if (unsaved && !unsavedFileIDs.includes(fileID)) {
        setUnsavedFileIDs([ ...unsavedFileIDs, fileID ])
      } 
    }
  }
  // 删除左侧文件
  const fileDelete = (fileID) => {
    delete files[fileID];
    setFiles(files);
    tabClose(fileID)
  }
  // 左侧文件搜索
  const fileSearch = (name) => {
    const searchAfter = filesArr.filter(file => file.title.includes(name) )
    console.log(searchAfter)
    setSearchedFiles(searchAfter)
  }
  // 新建文件
  const createNewFile = () => {
    const newID = uuidv4()
    const newFile = {
      id: newID,
      title: '',
      body: '## 请输出 Markdown',
      createdAt: new Date().getTime(),
      isNew: true,
    }
    setFiles({ ...files, [newID]: newFile })
  }
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch title='My Document' onFileSearch={value => fileSearch(value)} />
          <FileList
            files={fileListArr}
            onFileClick={id => fileClick(id)} 
            onFileDelete={id => fileDelete(id)} 
            onSaveEdit={(id, newValue, isNew) => fileChange(id, newValue, 'title', false, isNew)}
          />
          <div className='row no-gutters button-group'>
            <div className='col'>
              <BottomBtn  colorClass='btn-primary' icon={faPlus} onBtnClick={() => createNewFile()} />
            </div>
            <div className='col'>
              <BottomBtn text='导入' colorClass='btn-success' icon={faFileImport} />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {!activeFile ? (
            <div className="start-page">
              选择或者创建新的 Markdown 文档
            </div>
          ) : (
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unSaveIds={unsavedFileIDs}
                onTabClick={id => tabClick(id)}
                onCloseTab={id => tabClose(id)}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={value => fileChange(activeFile.id, value, 'body', true)}
                options={{
                  minHeight: '750px'
                }}
              />
            </>
          )
          }
        </div>
      </div>
    </div>
  );
}

export default App;
