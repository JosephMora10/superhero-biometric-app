import Foundation
import LocalAuthentication
import React

@objc(RTNBiometricAuth)
class RTNBiometricAuth: NSObject, RCTBridgeModule {
    
    static func moduleName() -> String! {
        return "RTNBiometricAuth"
    }
    
    // MARK: - Error Handling
    
    private func createErrorDictionary(from error: LAError) -> [String: Any] {
        let errorCode: String
        let errorMessage: String
        
        switch error.code {
        case .authenticationFailed:
            errorCode = "AuthenticationFailed"
            errorMessage = "Authentication was not successful because the user failed to provide valid credentials."
        case .userCancel:
            errorCode = "UserCancel"
            errorMessage = "Authentication was canceled by the user (e.g., tapped Cancel button)."
        case .userFallback:
            errorCode = "UserFallback"
            errorMessage = "Authentication was canceled because the user tapped the fallback button."
        case .systemCancel:
            errorCode = "SystemCancel"
            errorMessage = "Authentication was canceled by system (e.g., app went to background)."
        case .passcodeNotSet:
            errorCode = "PasscodeNotSet"
            errorMessage = "Authentication could not start because the passcode is not set on the device."
        case .biometryNotAvailable:
            errorCode = "BiometryNotAvailable"
            errorMessage = "Biometric authentication is not available on the device."
        case .biometryNotEnrolled:
            errorCode = "BiometryNotEnrolled"
            errorMessage = "Authentication could not start because the user has not enrolled any biometric identities."
        case .biometryLockout:
            errorCode = "BiometryLockout"
            errorMessage = "Biometric authentication was locked out due to too many failed attempts."
        case .appCancel:
            errorCode = "AppCancel"
            errorMessage = "Authentication was canceled by application."
        case .invalidContext:
            errorCode = "InvalidContext"
            errorMessage = "The context is invalid."
        case .watchNotAvailable:
            errorCode = "WatchNotAvailable"
            errorMessage = "Authentication could not start because Apple Watch is not available."
        case .notInteractive:
            errorCode = "NotInteractive"
            errorMessage = "Authentication failed because it would require showing UI that has been forbidden."
        @unknown default:
            errorCode = "UnknownError"
            errorMessage = "An unknown biometric authentication error occurred."
        }
        
        return [
            "code": errorCode,
            "message": errorMessage,
            "userInfo": error.userInfo
        ]
    }
    
    private func getBiometryTypeString(_ biometryType: LABiometryType) -> String {
        switch biometryType {
        case .none:
            return "None"
        case .touchID:
            return "TouchID"
        case .faceID:
            return "FaceID"
        case .opticID:
            return "OpticID"
        @unknown default:
            return "None"
        }
    }
    
    // MARK: - Public Methods
    
    @objc
    func checkBiometricsAvailable(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let context = LAContext()
        var authError: NSError?
        
        let isAvailable = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &authError)
        let biometryType = context.biometryType
        
        var result: [String: Any] = [
            "available": isAvailable,
            "biometryType": getBiometryTypeString(biometryType)
        ]
        
        if let error = authError as? LAError {
            result["error"] = createErrorDictionary(from: error)
        }
        
        resolve(result)
    }
    
    @objc
    func authenticateWithBiometrics(_ options: [String: Any], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        
        guard let reason = options["reason"] as? String else {
            let errorResult: [String: Any] = [
                "success": false,
                "error": [
                    "code": "InvalidContext",
                    "message": "Authentication reason is required",
                    "userInfo": [:]
                ]
            ]
            resolve(errorResult)
            return
        }
        
        let context = LAContext()
        
        // Configure context based on options
        if let fallbackTitle = options["fallbackTitle"] as? String {
            context.localizedFallbackTitle = fallbackTitle
        }
        
        if let cancelTitle = options["cancelTitle"] as? String {
            context.localizedCancelTitle = cancelTitle
        }
        
        if let disableDeviceFallback = options["disableDeviceFallback"] as? Bool, disableDeviceFallback {
            context.localizedFallbackTitle = ""
        }
        
        let policy: LAPolicy = .deviceOwnerAuthenticationWithBiometrics
        
        context.evaluatePolicy(policy, localizedReason: reason) { [weak self] success, error in
            DispatchQueue.main.async {
                var result: [String: Any] = ["success": success]
                
                if let error = error as? LAError, !success {
                    result["error"] = self?.createErrorDictionary(from: error)
                }
                
                resolve(result)
            }
        }
    }
    
    // MARK: - Required for RCTTurboModule
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
