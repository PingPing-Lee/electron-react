
import React from 'react'; 
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from "react-simplemde-editor";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "easymde/dist/easymde.min.css";

import FileSearch from './ components/FileSearch';
import FileList from './ components/FileList';
import BottomBtn from './ components/BottomBtn';
import TabList from './ components/TabList';
import defaultFiles from './utils/defaultFiles';
import { useState } from 'react/cjs/react.development';

// const onChange = useCallback((value: string) => {
//   setValue(value);
// }, []);

function App() {
  const [ files, setFiles ] = useState(defaultFiles)
  const [ activeFileID, setActiveFileID ] =useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIDs, setUnsavedFileIDs ] = useState([])
  // const [ searchedFiles, setSearchedFiles ] = useState([])
  // const [ isLoading, setLoading ] = useState(false)
  // const filesArr = objToArr(files)
  // const savedLocation = settingsStore.get('savedFileLocation') || remote.app.getPath('documents')
  const activeFile = files.find(file => file.id === activeFileID)
  const openedFiles = openedFileIDs.map(openID => {
    return files.find(file => file.id === openID)
  })
  // const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr

  // 左侧文件列表点击，右侧打开
  const fileClick = (fileID) => {
    console.log('onFileClick', fileID);
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
  // 文件的内容被编辑时
  const fileChange = (id, value) => {
    setUnsavedFileIDs([ ...unsavedFileIDs, id ])
  }
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch title='My Document' onFileSearch={value => { console.log(value);}} />
          <FileList
            files={defaultFiles}
            onFileClick={id => fileClick(id)} 
            onFileDelete={id => console.log('delete', id)} 
            onSaveEdit={(id, newValue) => console.log('save', id, newValue)} 
          />
          <div className='row no-gutters button-group'>
            <div className='col'>
              <BottomBtn  colorClass='btn-primary' icon={faPlus} />
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
                unsaveIds={unsavedFileIDs}
                onTabClick={id => tabClick(id)}
                onCloseTab={id => tabClose(id)}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={value => fileChange(activeFile.id, value)}
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
