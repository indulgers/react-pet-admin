import { createFromIconfontCN } from '@ant-design/icons';


const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3798935_5vdinlmyacu.js',
});

type Props = {
  name: string
}

import React from 'react';

const Icon: React.FC<Props> = ({ name }) => { 
  return (
    <MyIcon type={`icon-${name}`} />
  )
}

export default Icon
