import type { BasicTarget } from './domTarget'
import { getTargetElement } from './domTarget'

export default function getDocumentOrShadow(target: BasicTarget | BasicTarget[]): Document {
  const targetElement = Array.isArray(target) 
    ? getTargetElement(target[0]) 
    : getTargetElement(target)

  if (!targetElement) {
    return document
  }

  const rootNode = targetElement.getRootNode?.()
  
  if (rootNode && 'querySelector' in rootNode) {
    return rootNode as Document
  }

  return document
}
