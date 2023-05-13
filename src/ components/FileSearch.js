import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';

const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [ value, setValue ] = useState('');
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);

  const node = useRef(null);

  const closeSearch = () => {
    // e.preventDefault();
    setInputActive(false);
    setValue('');
    onFileSearch('');
  }
  useEffect(() => {
    if (enterPressed && inputActive ) {
      onFileSearch(value);
    } else if(escPressed && inputActive) {
      closeSearch();
    }
  })
  useEffect(() => {
    if (inputActive) node.current.focus()
  })

  return (
    <div className='container alert alert-primary d-flex justify-content-between align-items-center mb-0'>
      {
        !inputActive ? (
          <>
            <span>{title}</span>
            <button
              type='button'
              className='icon-btn'
              onClick={() => setInputActive(true)}
            >
              <FontAwesomeIcon title='搜索' icon={faSearch} size='lg'/>
            </button>
          </>
        ) : (
          <>
            <input 
              className='form-control' 
              value={value}
              ref={node}
              onChange={e => setValue(e.target.value)}
              style={{ height: '26px' }}
            />
            <button
              type='button'
              className='icon-btn'
              onClick={() => closeSearch()}
            >
              <FontAwesomeIcon title='关闭' icon={faTimes} size='lg'/>
            </button>
          </>
        )
      }
    </div>
  )
}

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired,
}

FileSearch.defaultProps = {
  title: '我的云文档'
}

export default FileSearch;