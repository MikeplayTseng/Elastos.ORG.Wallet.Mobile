// Copyright (c) 2012-2018 The Elastos Open Source Project
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include "ElaUtils.h"
#include "IMainchainSubWallet.h"
#include "nlohmann/json.hpp"

using namespace Elastos::SDK;

//"(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;JLjava/lang/String;Ljava/lang/String;)Ljava/lang/String;"
static jstring JNICALL nativeSendDepositTransaction(JNIEnv *env, jobject clazz, jlong jMainSubWalletProxy, jstring jfromAddress,
        jstring jsidechainAccounts, jstring jsidechainAmounts, jlong fee, jstring jpayPassword, jstring jmemo)
{
    const char* fromAddress = env->GetStringUTFChars(jfromAddress, NULL);
    const char* sidechainAccounts = env->GetStringUTFChars(jsidechainAccounts, NULL);
    const char* sidechainAmounts = env->GetStringUTFChars(jsidechainAmounts, NULL);
    const char* payPassword = env->GetStringUTFChars(jpayPassword, NULL);
    const char* memo = env->GetStringUTFChars(jmemo, NULL);

    IMainchainSubWallet* wallet = (IMainchainSubWallet*)jMainSubWalletProxy;
    std::string result = wallet->SendDepositTransaction(fromAddress, sidechainAccounts, sidechainAmounts, fee, payPassword, memo);

    env->ReleaseStringUTFChars(jfromAddress, fromAddress);
    env->ReleaseStringUTFChars(jsidechainAccounts, sidechainAccounts);
    env->ReleaseStringUTFChars(jsidechainAmounts, sidechainAmounts);
    env->ReleaseStringUTFChars(jpayPassword, payPassword);
    env->ReleaseStringUTFChars(jmemo, memo);

    return env->NewStringUTF(result.c_str());
}


static const JNINativeMethod gMethods[] = {
    {"nativeSendDepositTransaction", "(JLjava/lang/String;Ljava/lang/String;Ljava/lang/String;JLjava/lang/String;Ljava/lang/String;)Ljava/lang/String;", (void*)nativeSendDepositTransaction},
};

jint register_elastos_spv_IMainchainSubWallet(JNIEnv *env)
{
    return jniRegisterNativeMethods(env, "com/elastos/spvcore/IMainchainSubWallet",
        gMethods, NELEM(gMethods));
}