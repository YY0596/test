
/**
 * 文件帮助类型
 */
export class fileHelper {

    /**
     * 获取文件扩展名
     * @param fileName 文件名 
     */
    public static getfileExt(fileName: string): string {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
    }

    /**
     * 获取文件类型信息
     * @param fileName 文件名
     */
    public static getFileMimeType(fileName: string): string {
        let fileExt = this.getfileExt(fileName);
        let mimeType = '';
        switch (fileExt) {
            case 'txt':
                mimeType = 'text/plain';
                break;
            case 'docx':
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'doc':
                mimeType = 'application/msword';
                break;
            case 'pptx':
                mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                break;
            case 'ppt':
                mimeType = 'application/vnd.ms-powerpoint';
                break;
            case 'xlsx':
                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case 'xls':
                mimeType = 'application/vnd.ms-excel';
                break;
            case 'zip':
                mimeType = 'application/x-zip-compressed';
                break;
            case 'rar':
                mimeType = 'application/octet-stream';
                break;
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'jpg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            default:
                mimeType = 'application/' + fileExt;
                break;
        }
        return mimeType;
    }
}