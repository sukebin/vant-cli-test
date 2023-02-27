export const apice = {
  uploadFile: '/filemgr/comm/uploadFile', // 文件上传 - 上传文件
  delFile: '/filemgr/fileWeb/delFileInfo', // 文件上传 - 删除文件
  autoBuildNo: '/formengine/expression/autoBuildNo', // 编号 - 自动编号
  getFileSize: '/filemgr/comm/getFileSize', // 文件上传 - 获取文件大小
  getWcont: '/suppmgr/personal/getWcont', // 获取常用词列表
  getOrganTree: '/mainweb/organ/getOrganTree', // 获取组织树列表
  filePreview: '/filemgr/comm/filePreview', // 文件上传 - 文件预览
  getQrcodeUrl: '/formengine/support/convertContentToQrcode', // 二维码 - 获取二维码图片路径
  getStampdefTreeByUserId: '/suppmgr/support/getStampdefTreeByUserId', // 签名盖章 - 获取印章个人分类树列表
  // getShowStamp:'/formengine/stamp/showStamp', // 签名盖章 - 获取印章数据
  getShowStamp: '/suppmgr/stamp/showStamp', // 签名盖章 - 获取印章数据; 3.5.0使用新接口
  decryption: '/suppmgr/support/decryption', // 签名盖章 - 解密
  // onSignatureStamp:'/formengine/stamp/signatureStamp',// 签名印章 - 进行盖章
  onSignatureStamp: '/suppmgr/stamp/signatureStamp', // 签名印章 - 进行盖章 3.5.0使用新接口
  getSystemApprovalConfig: '/formengine/jobApproval/getSystemApprovalConfig', // 会签 - 获取系统时间
  getProcessShow: '/flowengine/form/getProcessShow', // 流程展示 - 获取环节
  getFlowProcessDiagram: '/flowengine/info/getFlowProcessDiagram', // 流程展示 - 获取流程图
  listTasksByProcessInstanceId: '/flowengine/info/listTasksByProcessInstanceId', // 流程展示 - 获取所有环节信息
};
