//
//  SceneDelegate.swift
//  ReactNativeShell
//
//  Created by Prateek Thapa on 03/11/2026.
//

import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNBootSplash

class SceneDelegate: RCTDefaultReactNativeFactoryDelegate, UIWindowSceneDelegate {
  var window: UIWindow?
  var reactNativeFactory: RCTReactNativeFactory?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }

    dependencyProvider = RCTAppDependencyProvider()
    let factory = RCTReactNativeFactory(delegate: self)
    reactNativeFactory = factory
    window = UIWindow(windowScene: windowScene)

    factory.startReactNative(
      withModuleName: "ReactNativeShell",
      in: window,
      launchOptions: nil
    )
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
}
