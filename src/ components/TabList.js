/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'

import PropTypes from 'prop-types';
import FileSearch from './FileSearch';
import useKeyPress from '../hooks/useKeyPress';
import './TabList.scss';
const TabList = ({ files, activeId, unSaveIds, onTabClick, onCloseTab }) => {
  const [ editStatus, setEditStatus ] = useState(false);
  const [ value, setValue ] = useState('');

  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  

  const closeSearch = () => {
    // e.preventDefault();
    setEditStatus(false);
    setValue('');
  }

  // useEffect(() => {
  //   if (enterPressed && editStatus) {
  //     const editItem = files.find(item => item.id === editStatus)
  //     onSaveEdit(editItem.id, value);
  //     setEditStatus(false);
  //     setValue('');
  //   } else if(escPressed && editStatus) {
  //     closeSearch();
  //   }
  // })

  return (
    <ul className='nav nav-pills tabList-component'>
      {
        files.map(item => {
          const withUnSaveMark = unSaveIds.includes(item.id)
          const fClassName = classNames({
            'nav-link': true,
            'active': item.id === activeId,
            'withUnsaved': withUnSaveMark
          })
          return (
            <li
              key={item.id}
              className='nav-item'
            >
              <a
                className={fClassName}
                href="#"
                onClick={ e => {
                  e.preventDefault();
                  onTabClick(item.id)
                }}
              >
                {item.title}
                <span
                  // type='button'
                  className='ml-2 close-icon'
                  onClick={e => {
                    e.stopPropagation();
                    onCloseTab(item.id)
                  }}
                >
                  <FontAwesomeIcon className='close-icon' title='faTimes' icon={faTimes} />
                </span>
                {
                  withUnSaveMark && (
                    <span className='rounded-circle ml-2 unsaved-icon'></span>
                  )
                }
              </a>
            </li>
          )
        })
      }

    </ul>
  )
}

TabList.prototype = {
  files: PropTypes.array,
  activeId: PropTypes.string,
  unSaveIds: PropTypes.array,
  onTabClick: PropTypes.func,
  onCloseTab: PropTypes.func,
}
TabList.defaultProps = {
  unSaveIds: []
}
export default TabList;