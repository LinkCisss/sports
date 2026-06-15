import ActivityKit
import WidgetKit
import SwiftUI

struct SportsLiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties
        var homeScore: Int
        var awayScore: Int
        var timerDisplay: String
        var isLive: Bool
    }

    // Static properties
    var matchName: String
    var homeTeamName: String
    var homeTeamShort: String
    var awayTeamName: String
    var awayTeamShort: String
}

@available(iOS 16.1, *)
struct SportsLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: SportsLiveActivityAttributes.self) { context in
            // Lock screen / Banner UI
            ZStack {
                LinearGradient(gradient: Gradient(colors: [Color.yellow.opacity(0.8), Color.red.opacity(0.8)]), startPoint: .leading, endPoint: .trailing)
                
                VStack {
                    Text(context.attributes.matchName)
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                        .padding(.top, 8)
                    
                    HStack {
                        // Home Team
                        VStack {
                            ZStack {
                                Circle().fill(Color.green).frame(width: 40, height: 40)
                                Text("H").bold().foregroundColor(.white) // Fallback for flag
                            }
                            Text(context.attributes.homeTeamShort).font(.caption).bold().foregroundColor(.white)
                        }
                        .padding(.leading, 16)
                        
                        Spacer()
                        
                        // Score & Time
                        HStack(alignment: .center, spacing: 20) {
                            Text("\(context.state.homeScore)").font(.system(size: 36, weight: .bold)).foregroundColor(.white)
                            Text(context.state.timerDisplay).font(.headline).foregroundColor(.white)
                            Text("\(context.state.awayScore)").font(.system(size: 36, weight: .bold)).foregroundColor(.white)
                        }
                        
                        Spacer()
                        
                        // Away Team
                        VStack {
                            ZStack {
                                Circle().fill(Color.red.opacity(0.6)).frame(width: 40, height: 40)
                                Text("A").bold().foregroundColor(.white) // Fallback for flag
                            }
                            Text(context.attributes.awayTeamShort).font(.caption).bold().foregroundColor(.white)
                        }
                        .padding(.trailing, 16)
                    }
                    .padding(.bottom, 12)
                }
            }
            .activityBackgroundTint(Color.black)
            .activitySystemActionForegroundColor(Color.white)
            
        } dynamicIsland: { context in
            // Dynamic Island UI
            DynamicIsland {
                // Expanded UI
                DynamicIslandExpandedRegion(.leading) {
                    VStack {
                        ZStack {
                            Circle().fill(Color.green).frame(width: 32, height: 32)
                            Text("H").bold().foregroundColor(.white)
                        }
                        Text(context.attributes.homeTeamShort).font(.caption).foregroundColor(.white)
                    }
                }
                DynamicIslandExpandedRegion(.trailing) {
                    VStack {
                        ZStack {
                            Circle().fill(Color.red.opacity(0.6)).frame(width: 32, height: 32)
                            Text("A").bold().foregroundColor(.white)
                        }
                        Text(context.attributes.awayTeamShort).font(.caption).foregroundColor(.white)
                    }
                }
                DynamicIslandExpandedRegion(.center) {
                    Text(context.attributes.matchName).font(.caption2).foregroundColor(.gray)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    HStack(spacing: 24) {
                        Text("\(context.state.homeScore)").font(.system(size: 32, weight: .bold)).foregroundColor(.white)
                        Text(context.state.timerDisplay).font(.headline).foregroundColor(.white)
                        Text("\(context.state.awayScore)").font(.system(size: 32, weight: .bold)).foregroundColor(.white)
                    }
                }
            } compactLeading: {
                Text("\(context.attributes.homeTeamShort) \(context.state.homeScore)").font(.caption).bold()
            } compactTrailing: {
                Text("\(context.state.awayScore) \(context.attributes.awayTeamShort)").font(.caption).bold()
            } minimal: {
                Text("⚽️")
            }
            .widgetURL(URL(string: "sports://match"))
            .keylineTint(Color.yellow)
        }
    }
}
