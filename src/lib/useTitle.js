import { useEffect } from 'react'
import { APP_NAME } from '../config.js'

export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : `${APP_NAME} — Ôn thi chứng chỉ đại lý bảo hiểm`
  }, [title])
}
