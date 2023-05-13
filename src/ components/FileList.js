import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'

import PropTypes from 'prop-types';
import FileSearch from './FileSearch';
import useKeyPress from '../hooks/useKeyPress';

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete}) => {

  const [ editStatus, setEditStatus ] = useState(false);
  const [ value, setValue ] = useState('');

  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  const node = useRef(null);

  const closeSearch = editItem => {
    // e.preventDefault();
    setEditStatus(false);
    setValue('');
    //  r如果 isNew，esc 时退出
    if(editItem.isNew) {
      onFileDelete(editItem.id)
    }

  }

  useEffect(() => {
    const editItem = files.find(item => item.id === editStatus)
    if (enterPressed && editStatus && value.trim() !== '') {
      onSaveEdit(editItem.id, value, editItem.isNew);
      setEditStatus(false);
      setValue('');
    } else if(escPressed && editStatus) {
      closeSearch(editItem);
    }
  })

  useEffect(() => {
    const newFile = files.find(file => file.isNew);
    if(newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }

  }, [files])

  useEffect(() => {
    if (editStatus) {
      node.current.focus()
    }
  }, [editStatus])

  return (
    <ul className='list-group list-group-flush file-list'>
      {
        files.map(file => (
          <li
            key={file.id}
            className='list-group-item bg-light d-flex justify-content-between  align-item-center file-item mx-0'
          >
            {
              (file.id === editStatus || file.isNew) ? (
                <>
                  <input 
                    ref={node}
                    className='form-control' 
                    value={value}
                    placeholder="请输入文件名称"
                    onChange={e => setValue(e.target.value)}
                    style={{ height: '26px' }}
                  />
                  <button
                    type='button'
                    className='icon-btn'
                    onClick={() => closeSearch(file)}
                  >
                    <FontAwesomeIcon title='关闭' icon={faTimes} size='lg'/>
                  </button>
                </>
              ) : (
                <>
                  <span className='col-2'>
                    <FontAwesomeIcon title='faMarkdown' icon={faMarkdown} size='lg'/>
                  </span>
                  <span
                    className='col-6 c-click'
                    onClick={() => onFileClick(file.id)}
                  >
                    {file.title}
                  </span>
                  <button
                    type='button'
                    className='icon-btn col-2'
                    onClick={() => {
                      setValue(file.title);
                      setEditStatus(file.id)
                    }}
                  >
                    <FontAwesomeIcon title='faEdit' icon={faEdit} size='lg'/>
                  </button>
                  <button
                    type='button'
                    className='icon-btn col-2'
                    onClick={() => onFileDelete(file.id)}
                  >
                    <FontAwesomeIcon title='faTrash' icon={faTrash} size='lg'/>
                  </button>
                </>
              )
            }
            
          </li>
        ))
      }

    </ul>
  )
}

FileSearch.prototype = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onSaveEdit: PropTypes.func,
  onFileDelete: PropTypes.func,
}

export default FileList;