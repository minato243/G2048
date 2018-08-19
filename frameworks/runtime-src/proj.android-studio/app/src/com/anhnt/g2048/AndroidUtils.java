package com.anhnt.g2048;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.games.AchievementsClient;
import com.google.android.gms.games.Games;
import com.google.android.gms.games.LeaderboardsClient;
import com.google.android.gms.games.Player;
import com.google.android.gms.games.PlayersClient;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

/*Created by thaod on 1/14/2018.*/

public class AndroidUtils {
    final static String TAG = "AndroidUtils";
    final static int RC_SIGN_IN = 1001;
    final static int RC_LEADERBOARD_ID = 1002;
    final static int RC_LEADERBOARD_ALL = 1003;

    public static AndroidUtils instance;

    private Activity ac;
    private AdmobHelper admobHelper;

    AchievementsClient mAchievementsClient;
    LeaderboardsClient mLeaderboardsClient;
    PlayersClient mPlayersClient;

    public AndroidUtils(Activity ac)
    {
        this.ac = ac;
    }

    public static void shareMyApp(){
        Intent sendIntent = new Intent();
        sendIntent.setAction(Intent.ACTION_SEND);
        sendIntent.putExtra(Intent.EXTRA_TEXT, "https://play.google.com/store/apps/details?id="+AndroidUtils.instance.ac.getPackageName());
        sendIntent.setType("text/plain");
        AndroidUtils.instance.ac.startActivity(Intent.createChooser(sendIntent, AndroidUtils.instance.ac.getResources().getText(R.string.app_name)));
    }

    public static void signIn(){
        Log.d(TAG,"signIn");
        if(AndroidUtils.instance.isSignedIn()){
            AndroidUtils.instance.signInSilently();
        } else{
            AndroidUtils.instance.startSignInIntent();
        }

    }

    public static void rateMyApp(){
        Activity ac = AndroidUtils.instance.ac;
        try {
            ac.startActivity(new Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse("market://details?id="
                            + ac
                            .getPackageName())));

        } catch (ActivityNotFoundException e) {
            ac.startActivity(new Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse("http://play.google.com/store/apps/details?id="
                            + ac
                            .getPackageName())));
        }
    }

    public static void showAllRanking(){
        AndroidUtils.instance.showAllLeaderBoard();
    }

    public static void showRanking(){
        AndroidUtils.instance.showLeaderBoard();
    }

    public static void updateHighScore(int highScore){
        Log.d(TAG,"updateHighScore "+ highScore);
        AndroidUtils.instance.updateScore(highScore);
    }

    public static void showInterstitialAd(){
        Log.d(TAG, "show InterstitialAd");
        AndroidUtils.instance.ac.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AndroidUtils.instance.admobHelper.showInterstitialAd();
            }
        });
    }

    public static void showVideoRewardAd(){
        Log.d(TAG, "showVideoRewardAd");
        AndroidUtils.instance.ac.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AndroidUtils.instance.admobHelper.showVideoRewardAd();
            }
        });
    }

    public static void showBanner(){
        Log.d(TAG, "showBanner");
        AndroidUtils.instance.ac.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AndroidUtils.instance.admobHelper.showAdView();
            }
        });
    }

    public static void hideBanner(){
        AndroidUtils.instance.ac.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AndroidUtils.instance.admobHelper.hideAdView();
            }
        });

    }

    public static void initBanner(){
        AndroidUtils.instance.ac.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AndroidUtils.instance.admobHelper.initBanner(AndroidUtils.instance.ac);  
            }
        });

    }


    public void showLeaderBoard(){
        if(mLeaderboardsClient == null) return;
        mLeaderboardsClient.getLeaderboardIntent(ac.getString(R.string.leader_board_id))
                .addOnSuccessListener(new OnSuccessListener<Intent>() {
                    @Override
                    public void onSuccess(Intent intent) {
                        ac.startActivityForResult(intent, RC_LEADERBOARD_ID);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        handleException(e, ac.getString(R.string.leaderboards_exception));
                    }
                });
    }

    public void updateScore(int score){
        Log.d(TAG, "updateScore "+ score);
        if(mLeaderboardsClient == null) return;
        mLeaderboardsClient.submitScore(ac.getString(R.string.leader_board_id), score);
    }

    public void updateScore(int mode, int score){
        Log.d(TAG, "updateScore "+ mode + " "+ score);
        if(mLeaderboardsClient == null) {
            Log.e(TAG, "mLeaderboardsClient null");
            return;
        }
        String leaderBoardId = ac.getString(R.string.leader_board_id);
        switch (mode){
            case 0:
                leaderBoardId = ac.getString(R.string.leader_board_id_small);
                break;
            case 1:
                leaderBoardId = ac.getString(R.string.leader_board_id_classic);
                break;
            case 2:
                leaderBoardId = ac.getString(R.string.leader_board_id_big);
                break;
            case 3:
                leaderBoardId = ac.getString(R.string.leader_board_id_bigger);
                break;

            case 4:
                leaderBoardId = ac.getString(R.string.leader_board_id_huge);
                break;
        }
        mLeaderboardsClient.submitScore(leaderBoardId, score);
    }

    public void showAllLeaderBoard(){
        if(mLeaderboardsClient == null) {
            Log.e(TAG, "mLeaderboardsClient null");
            return;
        }

        mLeaderboardsClient.getAllLeaderboardsIntent()
                .addOnSuccessListener(new OnSuccessListener<Intent>() {
            @Override
            public void onSuccess(Intent intent) {
                ac.startActivityForResult(intent, RC_LEADERBOARD_ALL);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Log.e(TAG,"showAllLeaderBoard failed");
            }
        })
        ;
    }

    private void startSignInIntent() {
        Log.d(TAG, "startSignInIntent");
        GoogleSignInClient signInClient = GoogleSignIn.getClient(ac,
                GoogleSignInOptions.DEFAULT_GAMES_SIGN_IN);
        Intent intent = signInClient.getSignInIntent();
        ac.startActivityForResult(intent, RC_SIGN_IN);

    }

    public void onActivityResult(int requestCode, int resultCode, Intent data){
        if(requestCode == RC_SIGN_IN){
            Log.d(TAG, "onActivityResult data ="+data.toString());
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            Log.d(TAG, "onActivityResult result ="+result.toString());
            Log.d(TAG, "onActivityResult status ="+result.getStatus());
            Log.d(TAG, "onActivityResult status ="+result.getStatus().getStatusCode());
            if(result.isSuccess()){
                GoogleSignInAccount signedInAccount = result.getSignInAccount();
                onConnected(signedInAccount);
            } else {
                String message = result.getStatus().getStatusMessage();
                if(message == null || message.isEmpty()){
                    message = ac.getString(R.string.signin_other_error);
                }

                new AlertDialog.Builder(ac).setMessage(message).
                        setNeutralButton(android.R.string.ok, null).show();
            }
        }
    }

    private boolean isSignedIn()
    {
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(ac);
        Log.d(TAG, "isSignedIn " + account == null ?"false":"true"+", account ="+ account);
        if(account != null) return true;
        return false;
    }

    private void onConnected(GoogleSignInAccount googleSignInAccount) {
        Log.d(TAG, "onConnected(): connected to Google APIs");

        mAchievementsClient = Games.getAchievementsClient(this.ac, googleSignInAccount);
        mLeaderboardsClient = Games.getLeaderboardsClient(this.ac, googleSignInAccount);
        mPlayersClient = Games.getPlayersClient(this.ac, googleSignInAccount);

        // Set the greeting appropriately on main menu
        mPlayersClient.getCurrentPlayer()
                .addOnCompleteListener(new OnCompleteListener<Player>() {
                    @Override
                    public void onComplete(@NonNull Task<Player> task) {
                        String displayName;
                        if (task.isSuccessful()) {
                            displayName = task.getResult().getDisplayName();
                        } else {
                            Exception e = task.getException();
                            handleException(e, ac.getString(R.string.players_exception));
                            displayName = "???";
                        }
                        Toast.makeText(ac, ac.getString(R.string.hello)+displayName, Toast.LENGTH_LONG );
                    }
                });
    }

    public void setAdmobHelper(AdmobHelper admobHelper) {
        this.admobHelper = admobHelper;
    }

    private void handleException(Exception e, String details) {
        int status = 0;

        if (e instanceof ApiException) {
            ApiException apiException = (ApiException) e;
            status = apiException.getStatusCode();
        }

        String message = ac.getString(R.string.status_exception_error, details, status, e);

        new AlertDialog.Builder(ac)
                .setMessage(message)
                .setNeutralButton(android.R.string.ok, null)
                .show();
    }

    public static void updateLeaderBoard(int mode, int score){
        Log.d(TAG, "updateLeaderBoard, mode = "+mode +"score = "+score);
        AndroidUtils.instance.updateScore(mode, score);
    }

    public void signInSilently() {
        Log.d(TAG, "signInSilently");
        GoogleSignInClient signInClient = GoogleSignIn.getClient(ac,
                GoogleSignInOptions.DEFAULT_GAMES_SIGN_IN);
        signInClient.silentSignIn().addOnCompleteListener(ac,
                new OnCompleteListener<GoogleSignInAccount>() {
                    @Override
                    public void onComplete(@NonNull Task<GoogleSignInAccount> task) {
                        if (task.isSuccessful()) {
                            // The signed in account is stored in the task's result.
                            GoogleSignInAccount signedInAccount = task.getResult();
                            onConnected(signedInAccount);
                        } else {
                            // Player will need to sign-in explicitly using via UI
                            Log.d(TAG, "signInSilently failed");
                            startSignInIntent();
                        }
                    }
                });
    }

    public void onResume() {
        if(isSignedIn())
            signInSilently();
    }

    public static void callJSAddGold(int num){
        String str = String.format("PlatformUtils.prototype.javaCallBackAddGold(%d);", num);
        Cocos2dxJavascriptJavaBridge.evalString(str);
    }
}
