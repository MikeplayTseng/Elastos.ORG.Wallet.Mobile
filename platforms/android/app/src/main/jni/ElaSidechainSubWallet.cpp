// Copyright (c) 2012-2018 The Elastos Open Source Project
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#include "ElaUtils.h"
#include "ISidechainSubWallet.h"
#include "nlohmann/json.hpp"

using namespace Elastos::SDK;

//"(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;JLjava/lang/String;Ljava/lang/String;)Ljava/lang/String;"
static jstring JNICALL nativeSendWithdrawTransaction(JNIEnv *env, jobject clazz, jlong jSideSubWalletProxy, jstring jfromAddress,
        jstring jmainchainAccounts, jstring jmainchainAmounts, jlong fee, jstring jpayPassword, jstring jmemo)
{
    const char* fromAddress = env->GetStringUTFChars(jfromAddress, NULL);
    const char* mainchainAccounts = env->GetStringUTFChars(jmainchainAccounts, NULL);
    const char* mainchainAmounts = env->GetStringUTFChars(jmainchainAmounts, NULL);
    const char* payPassword = env->GetStringUTFChars(jpayPassword, NULL);
    const char* memo = env->GetStringUTFChars(jmemo, NULL);

    ISidechainSubWallet* wallet = (ISidechainSubWallet*)jSideSubWalletProxy;
    std::string result = wallet->SendWithdrawTransaction(fromAddress, mainchainAccounts, mainchainAmounts, fee, payPassword, memo);

    env->ReleaseStringUTFChars(jfromAddress, fromAddress);
    env->ReleaseStringUTFChars(jmainchainAccounts, mainchainAccounts);
    env->ReleaseStringUTFChars(jmainchainAmounts, mainchainAmounts);
    env->ReleaseStringUTFChars(jpayPassword, payPassword);
    env->ReleaseStringUTFChars(jmemo, memo);

    return env->NewStringUTF(result.c_str());
}


static const JNINativeMethod gMethods[] = {
    {"nativeSendWithdrawTransaction", "(JLjava/lang/String;Ljava/lang/String;Ljava/lang/String;JLjava/lang/String;Ljava/lang/String;)Ljava/lang/String;", (void*)nativeSendWithdrawTransaction},
};

jint register_elastos_spv_ISidechainSubWallet(JNIEnv *env)
{
    return jniRegisterNativeMethods(env, "com/elastos/spvcore/ISidechainSubWallet",
        gMethods, NELEM(gMethods));
}