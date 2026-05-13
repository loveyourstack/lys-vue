import { type UseWebNotificationOptions } from '@vueuse/core'
import { useWebNotification } from '@vueuse/core'

const {show} = useWebNotification()

export function notify(company: string, action: string, iconUrl: string, body?: string) {
  const options: UseWebNotificationOptions = {title: company + ' - ' + action, icon: iconUrl, dir: 'auto', lang: 'en', renotify: true, tag: action}
  if (body) {
    options.body = body
  }
  show(options)
}